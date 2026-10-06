

import type { IChatParticipant } from 'src/types/chat';

import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { useChatRealtime } from 'src/contexts/chat-realtime-context';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  disabled: boolean;
  recipients: IChatParticipant[];
  selectedConversationId: string;
  onAddRecipients: (recipients: IChatParticipant[]) => void;
};

export function ChatMessageInput({
  disabled,
  recipients,
  onAddRecipients,
  selectedConversationId,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');
  
  const { sendMessage: sendWsMessage } = useChatRealtime();

  const handleAttach = useCallback(() => {
    toast.info('Recurso em implantação. O envio de anexos será liberado em breve.');
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter' || !message) return;
      
      const payload = {
        id: crypto.randomUUID(),
        body: message,
        contentType: 'text',
        createdAt: new Date(),
        senderId: 'mock-user-id' // Será substituído pelo backend ou context real
      };
      
      sendWsMessage(payload);
      setMessage('');
    },
    [message, sendWsMessage]
  );

  return (
    <Box 
      sx={{ 
        flexShrink: 0,
        p: { xs: 1.5, md: 2 }, 
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.60) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: (theme) => `solid 1px ${alpha(theme.palette.divider, 0.4)}`, 
        zIndex: 10,
        ...((theme) => theme.applyStyles('dark', {
          background: 'linear-gradient(180deg, rgba(22, 28, 36, 0.40) 0%, rgba(18, 23, 30, 0.65) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        })),
      }}
    >
      <Box
        sx={{
          maxWidth: '100%',
          mx: 'auto',
          border: (theme) => `solid 1px ${alpha(theme.palette.common.white, 0.55)}`,
          borderRadius: 2.2,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.75),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: (theme) => [
            `inset 0 1.5px 0 ${alpha(theme.palette.common.white, 0.85)}`,
            '0 8px 24px -6px rgba(15, 23, 42, 0.08)',
          ].join(', '),
          transition: (theme) => theme.transitions.create(['border-color', 'box-shadow', 'transform']),
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: (theme) => [
              `inset 0 1.5px 0 ${alpha(theme.palette.common.white, 0.9)}`,
              `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
              `0 12px 28px -6px ${alpha(theme.palette.primary.main, 0.20)}`,
            ].join(', '),
          },
          ...((theme: any) => theme.applyStyles('dark', {
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 24px -6px rgba(0, 0, 0, 0.5)',
            '&:focus-within': {
              borderColor: 'primary.main',
              boxShadow: '0 0 0 2px rgba(0, 167, 111, 0.35), 0 12px 28px -6px rgba(0, 0, 0, 0.7)',
            },
          })),
        }}
      >
        <InputBase
          multiline
          minRows={2}
          maxRows={6}
          name="chat-message"
          id="chat-message-input"
          value={message}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSendMessage(event as any);
            }
          }}
          onChange={handleChangeMessage}
          placeholder="Digite uma mensagem (use / para atalhos)..."
          disabled={disabled}
          sx={{
            p: 2,
            typography: 'body2',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.40),
            px: 1.5,
            py: 1,
            borderTop: (theme) => `solid 1px ${alpha(theme.palette.divider, 0.3)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Emojis">
              <IconButton 
                size="small" 
                onClick={handleAttach}
                sx={{
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.08)' }
                }}
              >
                <Iconify icon="eva:smiling-face-fill" width={20} />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 16, my: 'auto' }} />
            
            <Tooltip title="Anexar Arquivo">
              <IconButton 
                size="small" 
                onClick={handleAttach}
                sx={{
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.08)' }
                }}
              >
                <Iconify icon="eva:attach-2-fill" width={20} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Imagem">
              <IconButton 
                size="small" 
                onClick={handleAttach}
                sx={{
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.08)' }
                }}
              >
                <Iconify icon="solar:gallery-add-bold" width={20} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Documento">
              <IconButton 
                size="small" 
                onClick={handleAttach}
                sx={{
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.08)' }
                }}
              >
                <Iconify icon={"solar:document-add-bold" as any} width={20} />
              </IconButton>
            </Tooltip>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 16, my: 'auto' }} />
            
            <Tooltip title="NFT / PIX">
              <IconButton 
                size="small" 
                onClick={handleAttach}
                sx={{ 
                  borderRadius: '8px',
                  color: 'success.main',
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.10),
                  border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.20),
                    transform: 'translateY(-1px)',
                    boxShadow: (theme) => `0 4px 10px ${alpha(theme.palette.success.main, 0.3)}`,
                  }
                }}
              >
                <Iconify icon={"solar:card-bold" as any} width={18} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Gravar Áudio">
              <IconButton 
                size="small" 
                onClick={handleAttach}
                sx={{
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.08)' }
                }}
              >
                <Iconify icon="solar:microphone-bold" width={20} />
              </IconButton>
            </Tooltip>

            <Button
              size="small"
              variant="contained"
              onClick={handleSendMessage as any}
              disabled={disabled || !message.trim()}
              endIcon={<Iconify icon={"iconamoon:send-fill" as any} />}
              sx={{ 
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                fontWeight: 700,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #00A76F 0%, #007850 100%)',
                boxShadow: (theme) => [
                  'inset 0 1px 0 rgba(255, 255, 255, 0.40)',
                  `0 4px 14px -2px ${alpha(theme.palette.primary.main, 0.45)}`,
                ].join(', '),
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00B578 0%, #00895C 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: (theme) => [
                    'inset 0 1px 0 rgba(255, 255, 255, 0.50)',
                    `0 6px 18px -2px ${alpha(theme.palette.primary.main, 0.60)}`,
                  ].join(', '),
                },
                '&.Mui-disabled': {
                  background: (theme) => alpha(theme.palette.action.disabledBackground, 0.6),
                  boxShadow: 'none',
                }
              }}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
