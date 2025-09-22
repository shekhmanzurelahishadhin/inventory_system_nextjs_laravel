<?php


namespace App\Traits;


use Illuminate\Support\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploader
{
    /**
     * Delete a file from the storage disk if it exists.
     *
     * @param string|null $filePath
     * @param string $disk
     * @return bool
     */
    public function unlink(?string $filePath, string $disk = 'public'): bool
    {
        if ($filePath && Storage::disk($disk)->exists($filePath)) {
            return Storage::disk($disk)->delete($filePath);
        }

        return false;
    }

    /**
     * Upload a file to the storage disk (public by default).
     * Optionally delete an old file before uploading.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param string|null $oldFilePath
     * @param string $disk
     * @return string Path of uploaded file (relative to disk root)
     */
    public function fileUpload(UploadedFile $file, string $folder = 'uploads', ?string $oldFilePath = null, string $disk = 'public'): string
    {
        if ($oldFilePath) {
            // Delete previous file if provided
            $this->unlink($oldFilePath, $disk);
        }

        // Generate unique file name
        $currentDate = Carbon::now()->toDateString();
        $prefix = $currentDate.'-'.substr(uniqid(), 7, 10);
        $fileName = $prefix.'_'.pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $ext = strtolower($file->getClientOriginalExtension());
        $fileFullName = $fileName.'.'.$ext;

        // Save to disk
        $path = $file->storeAs($folder, $fileFullName, $disk);

        return $path; // e.g. "logos/2025-09-22-xxx_myfile.jpg"
    }

    /**
     * Get the full URL of a stored file.
     *
     * @param string|null $filePath
     * @param string $disk
     * @return string|null
     */
    public function fileUrl(?string $filePath, string $disk = 'public'): ?string
    {
        return $filePath ? Storage::disk($disk)->url($filePath) : null;
    }
}
