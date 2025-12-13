import React, { useCallback } from 'react';

/**
 * Props para o componente TablePagination.
 */
interface TablePaginationProps {
    /** Número total de páginas disponíveis. */
    totalPages: number;
    /** Página atualmente selecionada (base 1). */
    currentPage: number;
    /** Callback chamado ao trocar de página. */
    onPageChange: (page: number) => void;
}

/**
 * Componente de paginação reutilizável para tabelas.
 * Segue boas práticas de acessibilidade e performance.
 */
const TablePagination: React.FC<TablePaginationProps> = ({
    totalPages,
    currentPage,
    onPageChange,
}) => {
    // Função para trocar de página, memoizada para evitar recriação
    const handlePageChange = useCallback(
        (page: number) => {
            if (page >= 1 && page <= totalPages && page !== currentPage) {
                onPageChange(page);
            }
        },
        [onPageChange, totalPages, currentPage]
    );

    // Gera array de páginas
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav aria-label="Paginação de tarefas">
            <ul className="pagination justify-content-center">
                <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                    >
                        &laquo;
                    </button>
                </li>
                {pages.map((page) => (
                    <li key={page} className={`page-item${currentPage === page ? ' active' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                            aria-current={currentPage === page ? 'page' : undefined}
                            aria-label={`Página ${page}`}
                            tabIndex={0}
                        >
                            {page}
                        </button>
                    </li>
                ))}
                <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Próxima página"
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default TablePagination;