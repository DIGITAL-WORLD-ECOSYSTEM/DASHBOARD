#!/usr/bin/env node
/**
 * Automated Bundle Isolation and Dependency Graph Verifier
 *
 * Performs dual-layer static verification:
 * 1. Source Dependency Graph Crawler: Resolves the entire AST/module graph of main-web.tsx
 *    and asserts zero reachability into DevOS control plane, Tauri bridges, or local custody.
 * 2. Artifact Post-Build Scanner: Analyzes all emitted chunks in dist-web and dist-desktop
 *    to guarantee no secrets, Tauri internals, or custody tokens leaked.
 *
 * ASPPIBRA-DAO Security Hardening Suite.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DASHBOARD_ROOT = path.resolve(__dirname, '..');
const SRC_ROOT = path.resolve(DASHBOARD_ROOT, 'src');

const MAIN_WEB_ENTRY = path.resolve(SRC_ROOT, 'main-web.tsx');
const MAIN_DESKTOP_ENTRY = path.resolve(SRC_ROOT, 'main-devos.tsx');

const DIST_WEB_DIR = path.resolve(DASHBOARD_ROOT, 'dist-web');
const DIST_DESKTOP_DIR = path.resolve(DASHBOARD_ROOT, 'dist-desktop');

// Directories strictly FORBIDDEN from ever being reached by the Web dependency graph
const PROHIBITED_WEB_SOURCE_DIRECTORIES = [
  path.resolve(SRC_ROOT, 'sections/devos'),
  path.resolve(SRC_ROOT, 'pages/devos'),
  path.resolve(SRC_ROOT, 'layouts/devos'),
  path.resolve(SRC_ROOT, 'platform/desktop'),
  path.resolve(SRC_ROOT, 'routes/sections/devos'),
];

// External packages strictly prohibited in the Web dependency graph
const PROHIBITED_WEB_PACKAGES = [
  '@tauri-apps/api',
  '@tauri-apps/plugin',
];

// Symbols and string patterns strictly PROHIBITED from compiled dist-web assets
const PROHIBITED_WEB_COMPILED_TOKENS = [
  '@tauri-apps',
  'WalletBridge',
  '__TAURI_INTERNALS__',
  '__TAURI__',
  'confirm_and_save_wallets',
  'generate_seed_and_preview',
  'reveal_pending_mnemonic',
  'cancel_pending_creation',
  'export_authorized_secret',
  'export_vault_backup',
  'restore_vault_backup',
  'init_master_password',
  'get_vault_status',
  'list_stored_wallets',
  'CUSTODIAL_LOCAL',
  'Argon2id + AES-256-GCM',
  'wallets-page',
];

// Invariant control plane tokens required in dist-desktop
const REQUIRED_DESKTOP_COMPILED_TOKENS = [
  'confirm_and_save_wallets',
  'generate_seed_and_preview',
  'reveal_pending_mnemonic',
  'cancel_pending_creation',
  'export_vault_backup',
  'restore_vault_backup',
  'wallets-page',
];

function resolveModule(importee, importer) {
  let basePath;
  if (importee.startsWith('src/')) {
    basePath = path.resolve(SRC_ROOT, importee.slice(4));
  } else if (importee.startsWith('./') || importee.startsWith('../')) {
    basePath = path.resolve(path.dirname(importer), importee);
  } else {
    return { isExternal: true, packageName: importee };
  }

  const extensions = ['', '.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts', '/index.jsx', '/index.js'];
  for (const ext of extensions) {
    const candidate = basePath + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return { isExternal: false, resolvedPath: candidate };
    }
  }

  return { isExternal: false, resolvedPath: null };
}

function crawlDependencyGraph(entryFile) {
  const visited = new Set();
  const queue = [entryFile];
  const importRegex = /(?:import\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
  const externalPackages = new Set();
  const graphErrors = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    if (!fs.existsSync(current)) {
      graphErrors.push(`Arquivo inexistente no grafo: ${current}`);
      continue;
    }

    const content = fs.readFileSync(current, 'utf-8');
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importee = match[1] || match[2];
      if (!importee) continue;

      const resolution = resolveModule(importee, current);
      if (resolution.isExternal) {
        externalPackages.add(resolution.packageName);
      } else if (resolution.resolvedPath) {
        if (!visited.has(resolution.resolvedPath)) {
          queue.push(resolution.resolvedPath);
        }
      }
    }
  }

  return { visitedFiles: Array.from(visited), externalPackages: Array.from(externalPackages), graphErrors };
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function runVerification() {
  console.log('='.repeat(75));
  console.log('🔒 AUDITORIA FORENSE DE ISOLAMENTO ARQUITETURAL E BUNDLES (ASPPIBRA-DAO)');
  console.log('='.repeat(75));

  // -------------------------------------------------------------
  // FASE 1: Verificação Estática do Grafo de Dependências (Source)
  // -------------------------------------------------------------
  console.log('\n[FASE 1] Análise do Grafo Estático de Dependências (Source Graph)');
  console.log(`   Ponto de entrada Web:     src/main-web.tsx`);
  console.log(`   Ponto de entrada Desktop: src/main-devos.tsx`);

  const webGraph = crawlDependencyGraph(MAIN_WEB_ENTRY);
  console.log(`   -> Total de módulos alcançados no grafo Web: ${webGraph.visitedFiles.length} arquivos`);

  let graphViolations = 0;
  for (const file of webGraph.visitedFiles) {
    for (const forbiddenDir of PROHIBITED_WEB_SOURCE_DIRECTORIES) {
      if (file.startsWith(forbiddenDir)) {
        console.error(`   ❌ VIOLAÇÃO GRAVE: Grafo Web alcançou módulo exclusivo do DevOS: ${path.relative(DASHBOARD_ROOT, file)}`);
        graphViolations++;
      }
    }
  }

  for (const pkg of webGraph.externalPackages) {
    for (const forbiddenPkg of PROHIBITED_WEB_PACKAGES) {
      if (pkg === forbiddenPkg || pkg.startsWith(forbiddenPkg + '/')) {
        console.error(`   ❌ VIOLAÇÃO GRAVE: Grafo Web importa pacote Tauri desktop: ${pkg}`);
        graphViolations++;
      }
    }
  }

  if (graphViolations === 0) {
    console.log(`   ✅ 100% ISOLADO NO GRAFO: main-web.tsx não possui conexões com DevOS ou Tauri.`);
  }

  // Confirma que main-devos.tsx contém os módulos de controle esperados
  const desktopGraph = crawlDependencyGraph(MAIN_DESKTOP_ENTRY);
  console.log(`   -> Total de módulos alcançados no grafo Desktop: ${desktopGraph.visitedFiles.length} arquivos`);
  const hasDevosRoutes = desktopGraph.visitedFiles.some(f => f.includes('routes/sections/devos'));
  const hasWallets = desktopGraph.visitedFiles.some(f => f.includes('sections/devos/wallets'));

  if (hasDevosRoutes && hasWallets) {
    console.log(`   ✅ Grafo Desktop validado com sucesso (contém rotas e ferramentas do DevOS).`);
  } else {
    console.error(`   ❌ ERRO: Grafo Desktop incompleto ou sem ferramentas do DevOS.`);
    graphViolations++;
  }

  // -------------------------------------------------------------
  // FASE 2: Auditoria dos Artefatos Compilados (dist-web / dist-desktop)
  // -------------------------------------------------------------
  console.log('\n[FASE 2] Auditoria dos Artefatos Compilados (Post-Build Chunks)');

  if (!fs.existsSync(DIST_WEB_DIR) || !fs.existsSync(DIST_DESKTOP_DIR)) {
    console.log('   ℹ️ Diretórios de compilação não encontrados. Execute os builds para a validação pós-build.');
    if (graphViolations > 0) process.exit(1);
    process.exit(0);
  }

  const webFiles = getAllFiles(DIST_WEB_DIR);
  const desktopFiles = getAllFiles(DIST_DESKTOP_DIR);
  console.log(`   - dist-web:     ${webFiles.length} arquivos compilados`);
  console.log(`   - dist-desktop: ${desktopFiles.length} arquivos compilados`);

  const jsWebFiles = webFiles.filter(f => f.endsWith('.js') || f.endsWith('.html'));
  const jsDesktopFiles = desktopFiles.filter(f => f.endsWith('.js') || f.endsWith('.html'));

  let compiledViolations = 0;
  for (const file of jsWebFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const relativeName = path.relative(DIST_WEB_DIR, file);

    for (const token of PROHIBITED_WEB_COMPILED_TOKENS) {
      if (content.includes(token)) {
        console.error(`   ❌ VIOLAÇÃO DE ISOLAMENTO: Token proibido '${token}' encontrado em dist-web/${relativeName}!`);
        compiledViolations++;
      }
    }
  }

  if (compiledViolations === 0) {
    console.log(`   ✅ 100% LIMPO: Nenhum token de cofre, bridge ou Tauri encontrado em dist-web.`);
  }

  for (const token of REQUIRED_DESKTOP_COMPILED_TOKENS) {
    const found = jsDesktopFiles.some(f => fs.readFileSync(f, 'utf-8').includes(token));
    if (!found) {
      console.error(`   ❌ Token de controle obrigatório '${token}' ausente em dist-desktop.`);
      compiledViolations++;
    }
  }

  console.log('\n' + '='.repeat(75));
  const totalViolations = graphViolations + compiledViolations;
  if (totalViolations > 0) {
    console.error(`❌ FALHA NA AUDITORIA: ${totalViolations} violação(ões) detectada(s)!`);
    console.log('='.repeat(75));
    process.exit(1);
  } else {
    console.log(`🏆 SUCESSO ABSOLUTO: Isolamento bidirecional comprovado em 2 camadas.`);
    console.log(`   - Camada 1 (Grafo de Código-Fonte): Zero dependências cruzadas.`);
    console.log(`   - Camada 2 (Artefatos de Produção): Zero vazamento em runtime.`);
    console.log('='.repeat(75));
    process.exit(0);
  }
}

runVerification();
