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

import { Box, Button, Grid, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { EventSlide } from '../../../components/Slides/EventSlide';
import { DataTable } from '../../../components/Tables/Table';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  EventCategoryEnum,
  FF_EVENTS_CATEGORY_MAP,
  FF_Paths,
  ICreatedFilter,
  IEvent,
  IMetric,
  IPagedEventResponse,
} from '../../../interfaces';
import {
  DEFAULT_HIST_HEIGHT,
  DEFAULT_PADDING,
  DEFAULT_PAGE_LIMITS,
} from '../../../theme';
import { fetchCatcher, makeEventHistogram } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';

export const ActivityEvents: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Events
  const [events, setEvents] = useState<IEvent[]>();
  // Event totals
  const [eventTotal, setEventTotal] = useState(0);
  // Event types histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();
  // View transaction slide out
  const [viewEvent, setViewEvent] = useState<IEvent | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Events list
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.events
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((eventRes: IPagedEventResponse) => {
        setEvents(eventRes.items);
        setEventTotal(eventRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Events,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Large
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setEventHistData(makeEventHistogram(histTypes));
      })
      .catch((err) => {
        setEventHistData([]);
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const eventsColumnHeaders = [
    t('type'),
    t('id'),
    t('reference'),
    t('transactionID'),
    t('created'),
  ];

  const eventsRecords: IDataTableRecord[] | undefined = events?.map(
    (event) => ({
      key: event.id,
      columns: [
        {
          value: (
            <Typography>
              {t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
            </Typography>
          ),
        },
        {
          value: (
            <HashPopover shortHash={true} address={event.id}></HashPopover>
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={event.reference}
            ></HashPopover>
          ),
        },
        {
          value: (
            <HashPopover shortHash={true} address={event.tx}></HashPopover>
          ),
        },
        { value: dayjs(event.created).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => setViewEvent(event),
      leftBorderColor: FF_EVENTS_CATEGORY_MAP[event.type].color,
    })
  );

  return (
    <>
      <Header title={t('events')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allEvents')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
            }
          />
          <Box
            mt={1}
            pb={2}
            borderRadius={1}
            sx={{
              width: '100%',
              height: DEFAULT_HIST_HEIGHT,
              backgroundColor: 'background.paper',
            }}
          >
            <Histogram
              colors={makeColorArray(FF_EVENTS_CATEGORY_MAP)}
              data={eventHistData}
              indexBy="timestamp"
              keys={makeKeyArray(FF_EVENTS_CATEGORY_MAP)}
              includeLegend={true}
              emptyText={t('noEvents')}
              isEmpty={isHistogramEmpty(
                eventHistData ?? [],
                Object.keys(EventCategoryEnum)
              )}
            ></Histogram>
          </Box>
          <DataTable
            onHandleCurrPageChange={(currentPage: number) =>
              setCurrentPage(currentPage)
            }
            onHandleRowsPerPage={(rowsPerPage: number) =>
              setRowsPerPage(rowsPerPage)
            }
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={eventsRecords}
            columnHeaders={eventsColumnHeaders}
            paginate={true}
            emptyStateText={t('noEventsToDisplay')}
            dataTotal={eventTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </Grid>
      {viewEvent && (
        <EventSlide
          event={viewEvent}
          open={!!viewEvent}
          onClose={() => {
            setViewEvent(undefined);
          }}
        />
      )}
    </>
  );
};
