'use client';

import ReactPaginate from 'react-paginate';
import { toBengaliNumber } from '@/lib/utils';

interface PaginationProps {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
	marginPagesDisplayed?: number;
	pageRangeDisplayed?: number;
}

export default function Pagination({
	totalPages,
	currentPage,
	onPageChange,
	marginPagesDisplayed = 1,
	pageRangeDisplayed = 2,
}: PaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<div className="flex justify-center pt-8">
			<ReactPaginate
				previousLabel={
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				}
				nextLabel={
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				}
				breakLabel="..."
				pageCount={totalPages}
				marginPagesDisplayed={marginPagesDisplayed}
				pageRangeDisplayed={pageRangeDisplayed}
				onPageChange={(selected) => onPageChange(selected.selected + 1)}
				forcePage={currentPage - 1}
				pageLabelBuilder={(page) => toBengaliNumber(page)}
				containerClassName="flex items-center gap-1"
				pageClassName="page-item"
				pageLinkClassName="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-blue-400"
				previousClassName="page-item"
				previousLinkClassName="min-w-8 h-9 sm:h-10 px-2 sm:px-3 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
				nextClassName="page-item"
				nextLinkClassName="min-w-8 h-9 sm:h-10 px-2 sm:px-3 flex items-center justify-center rounded-lg font-medium text-sm transition-all bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm"
				breakClassName="w-9 h-9 flex items-center justify-center text-gray-400"
				breakLinkClassName="w-full h-full flex items-center justify-center"
				activeClassName="active"
				activeLinkClassName="!bg-blue-600 !text-white !border-blue-600 shadow-md"
				disabledClassName="opacity-50 cursor-not-allowed"
				disabledLinkClassName="!cursor-not-allowed hover:!bg-white hover:!border-gray-300"
				renderOnZeroPageCount={null}
			/>
		</div>
	);
}
