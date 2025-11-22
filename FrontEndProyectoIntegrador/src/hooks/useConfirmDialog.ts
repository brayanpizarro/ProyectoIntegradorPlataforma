import { useState, useCallback, createElement } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onConfirm: () => void | Promise<void>;
}

interface UseConfirmDialogReturn {
  showConfirm: (options: ConfirmDialogOptions) => void;
  ConfirmDialog: () => JSX.Element;
}

/**
 * Hook para diálogos de confirmación
 * @returns Función para mostrar diálogo y componente
 */
export function useConfirmDialog(): UseConfirmDialogReturn {
  const [dialogState, setDialogState] = useState<ConfirmDialogOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const showConfirm = useCallback((options: ConfirmDialogOptions) => {
    setDialogState(options);
  }, []);

  const handleConfirm = async () => {
    if (!dialogState) return;
    
    setLoading(true);
    try {
      await dialogState.onConfirm();
      setDialogState(null);
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDialogState(null);
  };

  const ConfirmDialog = () => 
    createElement(Dialog, {
      open: !!dialogState,
      onClose: handleCancel,
      children: [
        createElement(DialogTitle, { key: 'title' }, dialogState?.title || 'Confirmar acción'),
        createElement(DialogContent, { key: 'content' }, 
          createElement(DialogContentText, {}, dialogState?.message)
        ),
        createElement(DialogActions, { key: 'actions' }, [
          createElement(Button, {
            key: 'cancel',
            onClick: handleCancel,
            disabled: loading,
          }, dialogState?.cancelText || 'Cancelar'),
          createElement(Button, {
            key: 'confirm',
            onClick: handleConfirm,
            color: dialogState?.confirmColor || 'primary',
            disabled: loading,
            autoFocus: true,
          }, dialogState?.confirmText || 'Confirmar'),
        ]),
      ],
    });

  return { showConfirm, ConfirmDialog };
}
