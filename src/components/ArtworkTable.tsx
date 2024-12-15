import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { fetchArtworks } from '../api/artworks';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

// Custom type for DataTable page change event
interface DataTablePageParams {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
}

// Custom type for Checkbox change event
interface CheckboxChangeParams {
    originalEvent: Event;
    value: any;
    checked?: boolean;
}

const ArtworkTable: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
    const [rowInput, setRowInput] = useState<string>(''); // Tracks input for row numbers
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false); // Tracks dropdown visibility

    const rowsPerPage = 12; // Number of rows per page

    // Fetch data for the current page
    const fetchPageData = async (page: number) => {
        setLoading(true);
        try {
            const data = await fetchArtworks(page + 1); // API page numbers are 1-based
            setArtworks(
                data.data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    place_of_origin: item.place_of_origin,
                    artist_display: item.artist_display,
                    inscriptions: item.inscriptions,
                    date_start: item.date_start,
                    date_end: item.date_end,
                }))
            );
            setTotalRecords(data.pagination.total);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData(page);
    }, [page]);

    // Handle page changes
    const onPageChange = (event: DataTablePageParams) => {
        setPage(event.page);

        // Maintain selections across pages
        if (event.page > 0) {
            const firstRowOnCurrentPage = event.page * rowsPerPage;
            const newSelections = artworks.slice(0, firstRowOnCurrentPage)
                .filter((artwork) => selectedArtworks.some(selected => selected.id === artwork.id));

            setSelectedArtworks(newSelections);
        }
    };

    // Handle "Select All" checkbox change
    const onSelectAllChange = (e: CheckboxChangeParams) => {
        const checked = e.checked || false;

        if (checked) {
            const newSelections = artworks.filter(
                (artwork) =>
                    !selectedArtworks.some((selected) => selected.id === artwork.id)
            );
            setSelectedArtworks((prev) => [...prev, ...newSelections]);
        } else {
            setSelectedArtworks((prev) =>
                prev.filter(
                    (selected) => !artworks.some((artwork) => artwork.id === selected.id)
                )
            );
        }
    };

    // Handle individual row selection
    const onRowSelectChange = (rowData: Artwork, checked: boolean) => {
        if (checked) {
            setSelectedArtworks((prev) => [...prev, rowData]);
        } else {
            setSelectedArtworks((prev) =>
                prev.filter((artwork) => artwork.id !== rowData.id)
            );
        }
    };

    // Checkbox for individual rows
    const rowSelectionTemplate = (rowData: Artwork) => (
        <Checkbox
            onChange={(e: CheckboxChangeParams) =>
                onRowSelectChange(rowData, e.checked || false)
            }
            checked={selectedArtworks.some((artwork) => artwork.id === rowData.id)}
        />
    );

    // Determine if "Select All" should be checked for the current page
    const isAllSelected = artworks.every((artwork) =>
        selectedArtworks.some((selected) => selected.id === artwork.id)
    );

    // Handle row selection from input (handles global row index)
    const handleRowSelection = () => {
      const rowIndex = parseInt(rowInput.trim(), 10); // Convert to zero-based index
      if (rowIndex > 0 && rowIndex <= totalRecords) {
          const newSelections: Artwork[] = [];
          for (let i = 0; i < rowIndex; i++) {
              newSelections.push(artworks[i]);
          }
          setSelectedArtworks(newSelections);
      }
  
      setRowInput(''); // Clear input after submission
  };

    return (
        <div className="card">
            {/* Dropdown Menu */}
            <Dropdown
                value={dropdownVisible}
                options={[{ label: 'Select Rows', value: true }]}
                onChange={(e) => setDropdownVisible(e.value as boolean)}
            />

            {/* Input Box and Submit Button */}
            {dropdownVisible && (
                <div style={{ marginTop: '1rem' }}>
                    <input
                        type="text"
                        value={rowInput}
                        onChange={(e) => setRowInput(e.target.value)}
                        placeholder="Enter global row numbers"
                        style={{
                            padding: '0.5rem',
                            width: '300px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                    <button
                        onClick={handleRowSelection}
                        style={{
                            marginLeft: '0.5rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007ad9',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Submit
                    </button>
                </div>
            )}

            {/* Data Table */}
            <DataTable
                value={artworks}
                paginator
                rows={rowsPerPage}
                totalRecords={totalRecords}
                lazy
                loading={loading}
                onPage={onPageChange}
                first={page * rowsPerPage}
                dataKey="id"
            >
                <Column
                    header={<Checkbox onChange={(e: CheckboxChangeParams) => onSelectAllChange(e)} checked={isAllSelected} />}
                    body={rowSelectionTemplate}
                />
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>
        </div>
    );
};

export default ArtworkTable;