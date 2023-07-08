import React, { useEffect, useState, } from 'react';
import axios from 'axios';
import { RuasData, RuasResponse } from '../types/types';
import Modal from 'react-modal';
import Select from 'react-select';
import Mapbox from './Map';

import Swal from 'sweetalert2'

Modal.setAppElement('#root');

interface Option {
  id: number;
  unit: string;
}



const Tabel: React.FC = () => {
  const [ruasData, setRuasData] = useState<RuasData[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number>();
  const [ruas, setRuas] = useState<string>('');
  const [long, setLong] = useState<number>(0);
  const [kmAwal, setKmAwal] = useState<string>('');
  const [kmAkhir, setKmAkhir] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [updateRuasId, setUpdateRuasId] = useState<number | null>(null);
  const [editRowData, setEditRowData] = useState<RuasData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const tokens = localStorage.getItem('token');
  console.log(ruasData, "update")
  console.log(editRowData, "initial value edit")
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  type Coordinate = string;
  const [coordinatesss, setCoordinatesss] = useState<Coordinate[]>([]);

  const handleCoordinateUpdate = (newCoordinate: Coordinate) => {
    const coordinatesString = JSON.stringify(newCoordinate);
    setCoordinatesss((prevCoordinates) => [...prevCoordinates, coordinatesString]);
  };


  console.log(coordinatesss, "new map")


  //unit 
  useEffect(() => {
    const fetchUnitOptions = async () => {
      try {
        const response = await axios.get('http://34.101.145.49:3001/api/master-data/unit', {
          headers: {
            Authorization: `Bearer ${tokens}`
          }
        });

        const data = response.data.data.rows;
        const options = data.map((item: Option) => ({ id: item.id, unit: item.unit }));

        setOptions(options);

        console.log(options, "option")
      } catch (error) {
        console.error('Error fetching unit options:', error);
      }
    };

    fetchUnitOptions();

  }, [tokens]);



  const handleDelete = async (rowId: number) => {
    const rowData = ruasData.find((item) => item.id === rowId);
    setEditRowData(rowData || null);
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await axios.put(
          `http://34.101.145.49:3001/api/master-data/ruas/${rowId}`,
          {
            unit_id: rowData?.unit_id,
            ruas: rowData?.ruas,
            long: rowData?.long,
            km_awal: rowData?.km_awal,
            km_akhir: rowData?.km_akhir,
            status: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${tokens}`,
            },
          }
        );

        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        ).then(() => {

          location.reload();
        });
      } else {
        Swal.fire(
          'Cancelled',
          'Your file is safe.',
          'error'
        );
      }
    } catch (error) {
      // Tangani error jika terjadi
      console.error(error);
    }

  };

  //data table
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${tokens}`,
      },
    };

    axios.get<RuasResponse>(`http://34.101.145.49:3001/api/master-data/ruas?page=${currentPage}&per_page=10`, config)
      .then(response => {
        setRuasData(response.data.data);
        setTotalPages(response.data.total);

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [tokens, currentPage]);

  const handleCreateRuas = async () => {
    const statusValue = status ? 1 : 0;
    const payload = {
      unit_id: selectedUnit,
      ruas,
      long,
      km_awal: kmAwal,
      km_akhir: kmAkhir,
      status: statusValue,
      coordinates: coordinatesss
    };

    console.log(payload, "create");


    try {
      const response = await axios.post('http://34.101.145.49:3001/api/master-data/ruas', payload, {
        headers: {
          Authorization: `Bearer ${tokens}`
        }
      });
      console.log(response)

      // if (response.status === 200) {
      //   const refreshDataInterval = setInterval(setRuasData, 5 * 60 * 1000);
      //   clearInterval(refreshDataInterval); // Clear the previous interval
      //   const newInterval = setInterval(setRuasData, 2000); // Set new interval
      //   return () => {
      //     clearInterval(newInterval); // Clear the interval on cleanup
      //   };
      // }

      if (updateRuasId) {
        // Update existing ruas
        const response = await axios.put(`http://34.101.145.49:3001/api/master-data/ruas/${updateRuasId}`, payload, {
          headers: {
            Authorization: `Bearer ${tokens}`
          },

        });
        console.log(response)


      }

      Swal.fire({
        icon: 'success',
        title: 'success',
        text: 'Success insert data',
      });
      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {


      Swal.fire({
        icon: 'error',
        title: 'Error creating ruas',
        text: error.message,
      });

    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const edit = (rowId: number) => {
    setModalIsOpen(true);
    setUpdateRuasId(rowId);
    const rowData = ruasData.find((item) => item.id === rowId);
    setEditRowData(rowData || null);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUnit(0);
    setRuas('');
    setLong(0);

    setKmAkhir('');
    setStatus(false);
  };
  const handleChange = (option: Option | null) => {
    setSelectedOption(option);
    if (option) {

      setSelectedUnit(option.id)
      console.log(option.id);
    }
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = ruasData.filter((data) =>
    data.ruas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-screen min-h-screen bg-gray-100 flex  justify-center bg-gray-100 font-sans overflow-hidden">
        <div className="w-full lg:w-5/6">
          <div className='flex justify-between'><h2 className="mt-4 text-xl font-bold text-gray-700">Master Data Ruas</h2> <div className="p-4">
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for items"
              />
            </div>
          </div>
            <div className='mt-4'><button onClick={openModal} className="bg-blue-500 hover:bg-grey text-grey-darkest text-white font-bold py-2 px-4 rounded inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>

              <span>Tambah</span>
            </button></div>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}

            contentLabel="Create Ruas Modal"
          >
            <div>

              <h1 className="block text-center py-4 text-2xl font-bold text-gray-800 dark:text-white">{updateRuasId ? "Edit Ruas" : "Tambah Ruas"}</h1>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <label htmlFor="ruas" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Ruas:</label>
                  <input type="text" name="ruas" value={ruas} onChange={(e) => setRuas(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <label htmlFor="kmAwal" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Km Awal:</label>
                  <input type="text" name="km_awal" value={kmAwal || editRowData?.km_awal} onChange={(e) => {
                    console.log(e.target.value); // Check if the event is triggered
                    setKmAwal(e.target.value);
                  }} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
              </div>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <label htmlFor="unit" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Unit:</label>
                  <Select
                    options={options}
                    value={selectedOption}
                    onChange={handleChange}

                    getOptionLabel={(option: Option) => option.unit}
                    getOptionValue={(option: Option) => option.id.toString()}
                  />
                </div>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <label htmlFor="kmAkhir" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Km Akhir:</label>
                  <input type="text" id="kmAkhir" value={kmAkhir} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={(e) => setKmAkhir(e.target.value)} />
                </div>
              </div>
              <div className='flex flex-wrap -mx-3 mb-6'>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                  <label htmlFor="long" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >Panjang (KM):</label>
                  <input type="number" id="long" value={long} onChange={(e) => setLong(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>


                  <label htmlFor="status" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Status:</label>
                  <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" id="status" value={status ? 'active' : 'inactive'}
                    onChange={(e) => setStatus(e.target.value === 'active')}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>


              <Mapbox onCoordinateCreate={handleCoordinateUpdate} />
              <div className="flex justify-end ">
                <div className="py-2 m-2">
                  <button onClick={closeModal} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Batal
                  </button>
                </div>
                <div className=" px-1 py-2 m-2">
                  <button onClick={handleCreateRuas} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Simpan
                  </button>
                </div>

              </div>
            </div>

          </Modal>
          <div className="bg-white shadow-md rounded">

            <table className="min-w-max w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">No</th>
                  <th className="py-3 px-6 text-left">Ruas</th>
                  <th className="py-3 px-6 text-left">Unit Kerja</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredData?.sort((a, b) => a.id - b.id).map((item, i) => (
                  <tr className="border-b border-gray-200 hover:bg-gray-100" key={i}>
                    <td className="py-3 px-6 text-left whitespace-nowrap" >
                      <div className="flex items-center">
                        <span className="font-medium">{item.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap" >
                      <div className="flex items-center">
                        <span className="font-medium">{item.ruas}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap" >
                      <div className="flex items-center">
                        <span className="font-medium">{item.unit.unit}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap" >
                      <div className="flex items-center">
                        <span className="font-medium">{item.status ? 'Aktif' : 'Tidak Aktif'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-4">
                        <a
                          href="#"
                          data-tooltip="Delete"
                        // Add other necessary attributes
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>

                        </a>
                        <button


                          onClick={() => edit(item.id)}
                        // Add other necessary attributes
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>

                        </button>
                        <button

                          onClick={() => handleDelete(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>

                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


            <div className='p-3 flex justify-center'> <nav aria-label="Page navigation example">
              <ul className="inline-flex -space-x-px text-sm">
                <li>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Previous
                  </button>
                </li>
                <li>
                  <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{currentPage}</span>
                </li>
                <li>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Next
                  </button>
                </li>

              </ul>
            </nav></div>


          </div>
        </div>
      </div>
    </div>
  )
}
export default Tabel;