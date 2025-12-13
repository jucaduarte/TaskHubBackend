import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TablePagination from '../components/TablePagination';

describe('TablePagination', () => {
    const onPageChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar os botões de navegação e páginas corretamente', () => {
        render(
            <TablePagination totalPages={3} currentPage={2} onPageChange={onPageChange} />
        );

        // Botões de página
        expect(screen.getByLabelText('Página 1')).toBeInTheDocument();
        expect(screen.getByLabelText('Página 2')).toBeInTheDocument();
        expect(screen.getByLabelText('Página 3')).toBeInTheDocument();

        // Botão anterior e próximo
        expect(screen.getByLabelText('Página anterior')).toBeInTheDocument();
        expect(screen.getByLabelText('Próxima página')).toBeInTheDocument();

        // Página ativa
        const page2Button = screen.getByLabelText('Página 2');
        expect(page2Button.closest('li')).toHaveClass('active');
    });

    it('deve desabilitar o botão anterior na primeira página', () => {
        render(
            <TablePagination totalPages={3} currentPage={1} onPageChange={onPageChange} />
        );
        expect(screen.getByLabelText('Página anterior')).toBeDisabled();
    });

    it('deve desabilitar o botão próximo na última página', () => {
        render(
            <TablePagination totalPages={3} currentPage={3} onPageChange={onPageChange} />
        );
        expect(screen.getByLabelText('Próxima página')).toBeDisabled();
    });

    it('deve chamar onPageChange ao clicar nos botões de página', () => {
        render(
            <TablePagination totalPages={3} currentPage={2} onPageChange={onPageChange} />
        );

        fireEvent.click(screen.getByLabelText('Página 1'));
        expect(onPageChange).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getByLabelText('Página 3'));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('deve chamar onPageChange ao clicar nos botões anterior e próximo', () => {
        render(
            <TablePagination totalPages={3} currentPage={2} onPageChange={onPageChange} />
        );

        fireEvent.click(screen.getByLabelText('Página anterior'));
        expect(onPageChange).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getByLabelText('Próxima página'));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
});