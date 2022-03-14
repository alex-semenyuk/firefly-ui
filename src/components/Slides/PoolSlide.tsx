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

import { Chip, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { ITokenPool } from '../../interfaces';
import { PoolStateColorMap } from '../../interfaces/enums';
import { DEFAULT_PADDING } from '../../theme';
import { jsNumberForAddress } from '../../utils';
import { FFCopyButton } from '../Buttons/CopyButton';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';

interface Props {
  pool: ITokenPool;
  open: boolean;
  onClose: () => void;
}

export const PoolSlide: React.FC<Props> = ({ pool, open, onClose }) => {
  const { t } = useTranslation();

  const dataList: IDataListItem[] = [
    {
      label: t('id'),
      value: pool.id,
      button: <FFCopyButton value={pool.id} />,
    },
    {
      label: t('protocolID'),
      value: pool.protocolId,
      button: <FFCopyButton value={pool.protocolId} />,
    },
    {
      label: t('connector'),
      value: pool.connector,
      button: <FFCopyButton value={pool.connector} />,
    },
    {
      label: t('transactionID'),
      value: pool.tx.id,
      button: <FFCopyButton value={pool.tx.id} />,
    },
    {
      label: t('messageID'),
      value: pool.message ?? t('noMessageInTransfer'),
      button: pool.message ? <FFCopyButton value={pool.message} /> : undefined,
    },
    {
      label: t('state'),
      value: pool.state && (
        <Chip
          label={pool.state.toLocaleUpperCase()}
          sx={{ backgroundColor: PoolStateColorMap[pool.state] }}
        ></Chip>
      ),
    },
    {
      label: t('created'),
      value: dayjs(pool.created).format('MM/DD/YYYY h:mm A'),
    },
  ];

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <Grid item pb={DEFAULT_PADDING}>
            <Typography variant="subtitle1">{`${
              pool.standard
            } - ${pool.type.toLocaleUpperCase()}`}</Typography>
            <Grid
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              container
              pt={DEFAULT_PADDING}
            >
              <Grid container item justifyContent="flex-start" xs={1}>
                <Jazzicon diameter={34} seed={jsNumberForAddress(pool.name)} />
              </Grid>
              <Grid container item justifyContent="flex-start" xs={11}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14',
                  }}
                >
                  {pool.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Data list */}
          <Grid container item pb={DEFAULT_PADDING}>
            {dataList?.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
        </Grid>
      </DisplaySlide>
    </>
  );
};
