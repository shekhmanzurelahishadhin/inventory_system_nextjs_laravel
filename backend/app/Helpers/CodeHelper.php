<?php

if (!function_exists('generateCode')) {
    /**
     * Generate a unique code for a table
     *
     * @param string $prefix Optional prefix, e.g., 'CMP'
     * @param string $table Table name
     * @param string $column Column name for checking uniqueness
     * @return string
     */
    function generateCode(string $prefix, string $table, string $column = 'code'): string
    {
        $lastRecord = \DB::table($table)
            ->select($column)
            ->orderBy('id', 'desc')
            ->first();

        $number = 1;

        if ($lastRecord && !empty($lastRecord->$column)) {
            // Extract numeric part and increment
            preg_match('/(\d+)$/', $lastRecord->$column, $matches);
            if (!empty($matches[1])) {
                $number = (int) $matches[1] + 1;
            }
        }

        // Pad number to 4 digits
        $code = $prefix . str_pad($number, 4, '0', STR_PAD_LEFT);

        return $code;
    }
}
