import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface Filter {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: string[];
  filters?: Filter[];
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;
  createLabel?: string;
  emptyMessage?: string;
  rowsPerPageOptions?: number[];
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchKeys = [],
  filters = [],
  onRowClick,
  onEdit,
  onDelete,
  onCreate,
  createLabel = 'Создать',
  emptyMessage = 'Нет данных',
  rowsPerPageOptions = [10, 25, 50, 100],
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    if (value === 'all') {
      const newFilters = { ...activeFilters };
      delete newFilters[filterKey];
      setActiveFilters(newFilters);
    } else {
      setActiveFilters({ ...activeFilters, [filterKey]: value });
    }
    setCurrentPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchQuery && searchKeys.length > 0) {
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const value = String((item as any)[key] || '').toLowerCase();
          return value.includes(searchQuery.toLowerCase());
        })
      );
    }

    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      result = result.filter((item) => {
        const value = String((item as any)[filterKey] || '');
        return value === filterValue;
      });
    });

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal || '').toLowerCase();
        const bStr = String(bVal || '').toLowerCase();
        
        if (sortOrder === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return result;
  }, [data, searchQuery, searchKeys, activeFilters, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  const getCellValue = (row: T, column: Column<T>) => {
    const value = (row as any)[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }

    if (typeof value === 'boolean') {
      return value ? (
        <Badge variant="default">Да</Badge>
      ) : (
        <Badge variant="secondary">Нет</Badge>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((item, idx) => (
            <Badge key={idx} variant="outline">
              {String(item)}
            </Badge>
          ))}
          {value.length > 3 && (
            <Badge variant="outline">+{value.length - 3}</Badge>
          )}
        </div>
      );
    }

    return String(value || '—');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {searchKeys.length > 0 && (
            <div className="relative flex-1 max-w-md">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          )}

          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={activeFilters[filter.key] || 'all'}
              onValueChange={(value) => handleFilterChange(filter.key, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все {filter.label.toLowerCase()}</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {onCreate && (
          <Button onClick={onCreate} className="gradient-purple text-white border-none">
            <Icon name="Plus" size={18} />
            {createLabel}
          </Button>
        )}
      </div>

      <Card className="border-none shadow-lg glass-effect">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      style={{ width: column.width }}
                      className={column.sortable ? 'cursor-pointer select-none hover:bg-muted/50' : ''}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && (
                          <div className="flex flex-col">
                            <Icon
                              name="ChevronUp"
                              size={12}
                              className={sortKey === column.key && sortOrder === 'asc' ? 'text-primary' : 'text-muted-foreground'}
                            />
                            <Icon
                              name="ChevronDown"
                              size={12}
                              className={sortKey === column.key && sortOrder === 'desc' ? 'text-primary' : 'text-muted-foreground'}
                              style={{ marginTop: -8 }}
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableHead className="w-[100px]">Действия</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Icon name="Search" size={48} />
                        <p>{emptyMessage}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => (
                    <TableRow
                      key={row.id}
                      className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {getCellValue(row, column)}
                        </TableCell>
                      ))}
                      {(onEdit || onDelete) && (
                        <TableCell>
                          <div className="flex gap-2">
                            {onEdit && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit(row);
                                }}
                              >
                                <Icon name="Pencil" size={16} />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(row);
                                }}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Показано {startIndex + 1}–{Math.min(endIndex, filteredAndSortedData.length)} из {filteredAndSortedData.length}
                </span>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rowsPerPageOptions.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option} строк
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <Icon name="ChevronsLeft" size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                <span className="text-sm px-4">
                  Страница {currentPage} из {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <Icon name="ChevronsRight" size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
