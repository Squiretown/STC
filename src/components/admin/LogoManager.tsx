import React, { useState } from 'react';
import { Upload, Image, X, CheckCircle, AlertCircle, Eye, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCMS } from '../../hooks/useCMS';

interface LogoManagerProps {
  logoType: 'header' | 'footer';
  title: string;
  description: string;
}

const LogoManager: React.FC<LogoManagerProps> = ({ logoType, title, description }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { updateSetting, getSetting } = useCMS();

  // Logo settings keys
  const logoUrlKey = `${logoType}_logo_url`;
  const logoWidthKey = `${logoType}_logo_width`;
  const logoHeightKey = `${logoType}_logo_height`;

  // Get current values
  const currentLogoUrl = getSetting(logoUrlKey);
  const currentWidth = parseInt(getSetting(logoWidthKey, logoType === 'header' ? '120' : '100'));
  const currentHeight = parseInt(getSetting(logoHeightKey, logoType === 'header' ? '48' : '40'));

  // Preset sizes based on logo type
  const presetSizes = logoType === 'header' 
    ? [
        { name: 'Small', width: 80, height: 32 },
        { name: 'Medium', width: 120, height: 48 },
        { name: 'Large', width: 160, height: 64 },
        { name: 'Extra Large', width: 200, height: 80 }
      ]
    : [
        { name: 'Small', width: 60, height: 24 },
        { name: 'Medium', width: 100, height: 40 },
        { name: 'Large', width: 140, height: 56 },
        { name: 'Extra Large', width: 180, height: 72 }
      ];

  const [tempWidth, setTempWidth] = useState(currentWidth);
  const [tempHeight, setTempHeight] = useState(currentHeight);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, SVG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${logoType}-logo-${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(uploadData.path);

      // Update the logo URL setting
      const updateSuccess = await updateSetting(logoUrlKey, publicUrl);
      
      if (updateSuccess) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(`Failed to update ${logoType} logo setting`);
      }

    } catch (err) {
      console.error(`Error uploading ${logoType} logo:`, err);
      setError(err instanceof Error ? err.message : `Failed to upload ${logoType} logo`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    setUploading(true);
    setError(null);

    try {
      const updateSuccess = await updateSetting(logoUrlKey, '');
      
      if (updateSuccess) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(`Failed to remove ${logoType} logo setting`);
      }
    } catch (err) {
      console.error(`Error removing ${logoType} logo:`, err);
      setError(err instanceof Error ? err.message : `Failed to remove ${logoType} logo`);
    } finally {
      setUploading(false);
    }
  };

  const handleSizeUpdate = async (width: number, height: number) => {
    try {
      const widthSuccess = await updateSetting(logoWidthKey, width.toString());
      const heightSuccess = await updateSetting(logoHeightKey, height.toString());
      
      if (widthSuccess && heightSuccess) {
        setTempWidth(width);
        setTempHeight(height);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        throw new Error('Failed to update logo size settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update logo size');
    }
  };

  const applyPresetSize = (preset: typeof presetSizes[0]) => {
    handleSizeUpdate(preset.width, preset.height);
  };

  const resetToOriginal = () => {
    setTempWidth(currentWidth);
    setTempHeight(currentHeight);
  };

  const logoStyle = {
    width: `${previewMode ? tempWidth : currentWidth}px`,
    height: `${previewMode ? tempHeight : currentHeight}px`,
    maxWidth: '100%',
    objectFit: 'contain' as const
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>

      {/* Current Logo Display with Preview */}
      {currentLogoUrl && (
        <div className="bg-slate-50 rounded-lg p-6 border-2 border-dashed border-slate-300">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-700">Current Logo Preview</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                    previewMode 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  <Eye className="h-3 w-3 mr-1 inline" />
                  {previewMode ? 'Live Preview' : 'Preview Off'}
                </button>
                <button
                  onClick={handleRemoveLogo}
                  disabled={uploading}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                  title="Remove logo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center bg-white p-4 rounded border min-h-[100px]">
              <img
                src={currentLogoUrl}
                alt={`Current ${logoType} logo`}
                style={logoStyle}
                className="transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            
            <div className="text-xs text-slate-500 break-all">
              <strong>URL:</strong> {currentLogoUrl}
              <br />
              <strong>Size:</strong> {previewMode ? tempWidth : currentWidth} × {previewMode ? tempHeight : currentHeight} pixels
            </div>
          </div>
        </div>
      )}

      {/* Size Controls */}
      {currentLogoUrl && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h4 className="font-medium text-slate-700 mb-4">Logo Size Controls</h4>
          
          {/* Preset Sizes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 mb-3">Preset Sizes</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presetSizes.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPresetSize(preset)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-slate-500">{preset.width}×{preset.height}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Size Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Width (px)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="40"
                  max="300"
                  value={tempWidth}
                  onChange={(e) => setTempWidth(parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="40"
                  max="300"
                  value={tempWidth}
                  onChange={(e) => setTempWidth(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Height (px)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="16"
                  max="200"
                  value={tempHeight}
                  onChange={(e) => setTempHeight(parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="16"
                  max="200"
                  value={tempHeight}
                  onChange={(e) => setTempHeight(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Size Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSizeUpdate(tempWidth, tempHeight)}
              disabled={tempWidth === currentWidth && tempHeight === currentHeight}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Apply Size Changes
            </button>
            <button
              onClick={resetToOriginal}
              className="px-4 py-2 bg-slate-500 text-white text-sm rounded hover:bg-slate-600 transition-colors duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-1 inline" />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors duration-200">
        <div className="text-center">
          <Image className="mx-auto h-12 w-12 text-slate-400" />
          <div className="mt-4">
            <label htmlFor={`${logoType}-logo-upload`} className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-slate-700">
                {currentLogoUrl ? `Upload New ${title}` : `Upload ${title}`}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                PNG, JPG, SVG, or WebP up to 5MB
              </span>
            </label>
            <input
              id={`${logoType}-logo-upload`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor={`${logoType}-logo-upload`}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 cursor-pointer ${
                uploading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <p className="text-green-700 text-sm">
            {logoType === 'header' ? 'Header' : 'Footer'} logo updated successfully!
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LogoManager;