/* eslint-disable react/no-array-index-key */
import React from 'react';
import { base64Svg } from '../svgs';

import Styled from './styled';
import { IDataTable, DataTableItem } from '../types';

function DataTable<T extends DataTableItem>({
  heading = [],
  items = [],
  mapping = [],
  onRowClick,
  onRenderCell,
  onRenderEmpty = () => null,
  onRenderActions
}: IDataTable<T>): JSX.Element {
  const getHeading = (): React.ReactNode =>
    items?.length
      ? heading.map((header, i) => (
          <Styled.DataTableColumn
            key={`dt_h_${i}`}
            data-testid="data-table-header"
          >
            {header}
          </Styled.DataTableColumn>
        ))
      : null;

  function getCellData<CellData extends Record<string, React.ReactText>>(
    item: CellData,
    prop: keyof CellData & string
  ): React.ReactChild {
    const _prop = prop.endsWith('?')
      ? prop.substring(0, prop.length - 1)
      : prop;

    const assert = (value: React.ReactText): React.ReactChild => {
      if (prop.endsWith('?'))
        return value ? <img src={base64Svg.success.raw} alt="OK" /> : '-';

      return value || '-';
    };

    if (!_prop.includes('.')) return assert(item[_prop]);

    // Property path as list,
    // eg. 'user.phone.prefix' -> ['user', 'phone', 'prefix']
    const list = _prop.split('.');

    const itemData = list.reduce((previousValue, currentValue) => {
      if (typeof previousValue === 'object' && previousValue !== null) {
        return currentValue in previousValue
          ? previousValue[currentValue]
          : '-';
      }

      return item[currentValue] as string;
    }, '');

    return assert(itemData);
  }

  const getBody = (): React.ReactNode =>
    items?.length ? (
      <>
        {items?.map((item, index) => (
          <Styled.DataTableRow
            data-testid="data-table-row"
            index={index}
            key={`dt_row_${index}`}
            onClick={() => onRowClick && onRowClick(item, index)}
          >
            {mapping.map((prop, i) => (
              <Styled.DataTableColumn
                data-testid="data-table-column"
                key={`dt_col_${i}`}
              >
                {onRenderCell
                  ? onRenderCell(item, prop, index)
                  : getCellData(item as DataTableItem<React.ReactText>, prop)}
              </Styled.DataTableColumn>
            ))}
            {onRenderActions && (
              <Styled.DataTableColumn
                data-testid="data-table-column-actions"
                style={{ flex: 1 }}
              >
                {onRenderActions(item)}
              </Styled.DataTableColumn>
            )}
          </Styled.DataTableRow>
        ))}
      </>
    ) : (
      onRenderEmpty()
    );

  return (
    <Styled.DataTable data-testid="data-table">
      <Styled.DataTableHead data-testid="data-table-head">
        {getHeading()}
      </Styled.DataTableHead>
      <Styled.DataTableBody data-testid="data-table-body">
        {getBody()}
      </Styled.DataTableBody>
    </Styled.DataTable>
  );
}

export default DataTable;
