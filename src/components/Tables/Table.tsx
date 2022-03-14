// Copyright © 2022 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { DEFAULT_PAGE_LIMITS, themeOptions } from '../../theme';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { DataTableEmptyState } from './TableEmptyState';
import { IDataTableRecord } from './TableInterfaces';
import { DataTableRow } from './TableRow';

interface Props {
  records?: IDataTableRecord[];
  columnHeaders?: string[];
  stickyHeader?: boolean;
  header?: string;
  minHeight?: string;
  maxHeight?: string;
  emptyStateText?: string;
  headerBtn?: JSX.Element;
  paginate?: boolean;
  onHandleCurrPageChange?: any;
  onHandleRowsPerPage?: any;
  currentPage?: number;
  rowsPerPage?: number;
  dataTotal?: number;
}

export const DataTable: React.FC<Props> = ({
  records,
  columnHeaders,
  stickyHeader,
  header,
  headerBtn,
  minHeight,
  maxHeight,
  emptyStateText,
  paginate,
  onHandleCurrPageChange,
  onHandleRowsPerPage,
  currentPage,
  rowsPerPage,
  dataTotal,
}) => {
  const handleChangePage = (_event: unknown, newPage: number) => {
    if (currentPage && rowsPerPage && dataTotal) {
      if (
        newPage > currentPage &&
        rowsPerPage * (currentPage + 1) >= dataTotal
      ) {
        return;
      }
    }
    onHandleCurrPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onHandleCurrPageChange(0);
    onHandleRowsPerPage(+event.target.value);
  };

  return (
    <>
      <Grid item xs={12}>
        {header && (
          <Grid container alignItems={'center'}>
            <Grid container item xs={6} justifyContent="flex-start">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {header}
              </Typography>
            </Grid>
            {headerBtn && (
              <Grid container item xs={6} justifyContent="flex-end">
                {headerBtn}
              </Grid>
            )}
          </Grid>
        )}

        {!records ? (
          <FFCircleLoader color="warning"></FFCircleLoader>
        ) : records.length ? (
          <>
            <TableContainer
              style={{ maxHeight, minHeight }}
              sx={{ paddingTop: 1, whiteSpace: 'nowrap' }}
            >
              <Table stickyHeader={stickyHeader}>
                <TableHead>
                  <TableRow>
                    {columnHeaders?.map((header, index) => (
                      <TableCell
                        sx={{
                          borderBottom: 0,
                        }}
                        key={index}
                      >
                        <Typography
                          sx={{
                            color: themeOptions.palette?.text?.secondary,
                            fontSize: 12,
                            textTransform: 'uppercase',
                          }}
                          noWrap
                        >
                          {header}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records?.map((record) => (
                    <DataTableRow
                      key={record.key}
                      leftBorderColor={record.leftBorderColor}
                      {...{ record }}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {paginate &&
              handleChangePage !== undefined &&
              handleChangeRowsPerPage !== undefined &&
              currentPage !== undefined &&
              rowsPerPage !== undefined &&
              dataTotal !== undefined && (
                <TablePagination
                  component="div"
                  count={-1}
                  rowsPerPage={rowsPerPage ?? 5}
                  page={currentPage ?? 0}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={DEFAULT_PAGE_LIMITS}
                  labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
                  sx={{ color: 'text.secondary' }}
                />
              )}
          </>
        ) : (
          <DataTableEmptyState message={emptyStateText}></DataTableEmptyState>
        )}
      </Grid>
    </>
  );
};
