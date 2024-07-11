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

import { Chip } from '@mui/material';
import React from 'react';
import {
  ITokenPool,
  PoolStateColorMap,
  PoolStateString,
} from '../../interfaces';

interface Props {
  pool: ITokenPool;
}

export const PoolStatusChip: React.FC<Props> = ({ pool }) => {
  return (
    <Chip
      label={PoolStateString(pool.active)}
      sx={{ backgroundColor: PoolStateColorMap(pool.active) }}
    />
  );
};
