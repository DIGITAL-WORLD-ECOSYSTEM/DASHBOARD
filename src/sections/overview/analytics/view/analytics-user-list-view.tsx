import type { TableHeadCellProps } from 'src/components/table';
import type { IUserItem, IUserTableFilters } from 'src/types/user';

import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _mock, _roles } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { deleteCitizen, useGetCitizens, deleteCitizens } from 'src/actions/identity';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Carousel, useCarousel, CarouselArrowBasicButtons } from 'src/components/carousel';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { UserCard } from 'src/sections/user/user-card';
import { UserTableRow } from 'src/sections/user/user-table-row';
import { UserTableToolbar } from 'src/sections/user/user-table-toolbar';
import { AppWidgetSummary } from 'src/sections/overview/app/app-widget-summary';
import { UserTableFiltersResult } from 'src/sections/user/user-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'banned', label: 'Banidos' },
  { value: 'rejected', label: 'Rejeitados' },
];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'name', label: 'Nome' },
  { id: 'phoneNumber', label: 'Telefone', width: 180 },
  { id: 'company', label: 'Empresa', width: 220 },
  { id: 'role', label: 'Cargo', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function AnalyticsUserListView() {
  const theme = useTheme();
  const table = useTable();
  const confirmDialog = useBoolean();

  const { citizens, mutate } = useGetCitizens();
  const [tableData, setTableData] = useState<IUserItem[]>([]);

  useEffect(() => {
    if (citizens) {
      setTableData(citizens);
    }
  }, [citizens]);

  const filters = useSetState<IUserTableFilters>({ name: '', role: [], status: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name || currentFilters.role.length > 0 || currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        await deleteCitizen(id);
        toast.success('Usuário removido com sucesso!');
        mutate();
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch {
        toast.error('Erro ao remover usuário.');
      }
    },
    [dataInPage.length, table, mutate]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteCitizens(table.selected.map(Number));
      toast.success('Usuários removidos com sucesso!');
      mutate();
      table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
    } catch {
      toast.error('Erro ao remover usuários.');
    }
  }, [dataFiltered.length, dataInPage.length, table, mutate]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  // Map filtered data to IUserCard structures
  const mappedUserCards = useMemo(
    () =>
      dataFiltered.map((citizen, index) => ({
        id: citizen.id,
        name: citizen.name,
        role: citizen.role || 'Cidadão',
        avatarUrl: citizen.avatarUrl || _mock.image.avatar(index % 20),
        coverUrl: _mock.image.cover(index % 20),
        totalFollowers: 0,
        totalFollowing: 0,
        totalPosts: 0,
      })),
    [dataFiltered]
  );

  // Initialize Carousel
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: {
      xs: 1,
      sm: 2,
      md: 3,
    },
  });

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Remover Usuários"
      content={
        <>
          Tem certeza que deseja remover <strong> {table.selected.length} </strong> usuários?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Remover
        </Button>
      }
    />
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Usuários"
          action={
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
                onClick={() => window.print()}
              >
                Imprimir
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:import-bold" />}
                onClick={() => toast.info('Importação iniciada')}
              >
                Importar
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:export-bold" />}
                onClick={() => toast.info('Exportação iniciada')}
              >
                Exportar
              </Button>

              <Button
                component={RouterLink}
                href={paths.dashboard.user.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Novo Usuário
              </Button>
            </Stack>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {/* Painel de Cartões de Resumo Analítico */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AppWidgetSummary
              title="Cidadãos Ativos"
              percent={2.6}
              total={tableData.filter((user) => user.status === 'active').length}
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [15, 18, 12, 51, 68, 11, 39, 37],
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <AppWidgetSummary
              title="Total de Membros"
              percent={0.2}
              total={tableData.length}
              chart={{
                colors: [theme.palette.info.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [20, 41, 63, 33, 28, 35, 50, 46],
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <AppWidgetSummary
              title="Pendentes KYC"
              percent={-0.1}
              total={tableData.filter((user) => user.status === 'pending').length}
              chart={{
                colors: [theme.palette.error.main],
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [18, 19, 31, 8, 16, 37, 12, 33],
              }}
            />
          </Grid>
        </Grid>

        {/* Card 1: Filtros Globais */}
        <Card sx={{ mb: 5 }}>
          <Tabs
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (t) => ({
                px: { md: 2.5 },
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(t.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: _roles }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
        </Card>

        {/* Card 2: Galeria de Membros em Carrossel */}
        {mappedUserCards.length > 0 && (
          <Box sx={{ mb: 5, position: 'relative' }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Galeria de Membros ({mappedUserCards.length})</Typography>
              <CarouselArrowBasicButtons {...carousel.arrows} options={carousel.options} />
            </Stack>

            <Carousel carousel={carousel}>
              {mappedUserCards.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </Carousel>
          </Box>
        )}

        {/* Card 3: Planilha Analítica de Usuários */}
        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Remover selecionados">
                  <IconButton color="primary" onClick={confirmDialog.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={paths.dashboard.user.edit(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IUserItem[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((user) => user.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
