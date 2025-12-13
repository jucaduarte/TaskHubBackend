/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useRef } from 'react';

interface DialogBoxModalProps {
    show: boolean;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
    loading?: boolean;
    children?: React.ReactNode;
}

const DialogBoxModal: React.FC<DialogBoxModalProps> = ({
    show,
    title = 'Confirmação',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    showCancel = true,
    onConfirm,
    onCancel,
    loading = false,
    children
}) => {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (show && confirmButtonRef.current) {
            confirmButtonRef.current.focus();
        }
    }, [show]);

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!loading) {
            onConfirm();
        }
    };

    return (
        <div
            className={`modal fade${show ? ' show d-block' : ''}`}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-modal-title"
            aria-hidden={!show}
            style={{ background: show ? 'rgba(0,0,0,0.5)' : undefined }}
        >
            <div className="modal-dialog" role="document">
                <form className="modal-content" onSubmit={handleConfirm}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="dialog-modal-title">{title}</h5>
                        {showCancel && onCancel && (
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Fechar"
                                onClick={onCancel}
                                disabled={loading}
                            />
                        )}
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        {showCancel && onCancel && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onCancel}
                                disabled={loading}
                                aria-label="Cancelar"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            aria-label={confirmText}
                            ref={confirmButtonRef}
                        >
                            {loading ? 'Processando...' : confirmText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DialogBoxModal;