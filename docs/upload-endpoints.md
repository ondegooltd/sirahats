# Image Upload Endpoints

This document describes the image upload endpoints for Products and Collections using Cloudinary.

## Environment Variables

Add these to your `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Product Image Upload

### Upload Multiple Product Images

**Endpoint:** `POST /api/upload/product`

**Authentication:** Required

**Request:**
- Content-Type: `multipart/form-data`
- Body: Multiple image files

**Response:**
```json
{
  "success": true,
  "message": "2 image(s) uploaded successfully",
  "data": [
    {
      "public_id": "sirahats/products/abc123",
      "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/abc123.jpg",
      "width": 800,
      "height": 800,
      "format": "jpg"
    }
  ]
}
```

**Example Usage:**
```javascript
const formData = new FormData();
formData.append('image1', file1);
formData.append('image2', file2);

const response = await fetch('/api/upload/product', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData
});
```

### Delete Product Images

**Endpoint:** `DELETE /api/upload/product`

**Authentication:** Required

**Request Body:**
```json
{
  "publicIds": ["sirahats/products/abc123", "sirahats/products/def456"]
}
```

## Collection Image Upload

### Upload Single Collection Image

**Endpoint:** `POST /api/upload/collection`

**Authentication:** Required

**Request:**
- Content-Type: `multipart/form-data`
- Body: Single image file

**Response:**
```json
{
  "success": true,
  "message": "Collection image uploaded successfully",
  "data": {
    "public_id": "sirahats/collections/abc123",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v123/abc123.jpg",
    "width": 600,
    "height": 600,
    "format": "jpg"
  }
}
```

### Delete Collection Image

**Endpoint:** `DELETE /api/upload/collection`

**Authentication:** Required

**Request Body:**
```json
{
  "publicId": "sirahats/collections/abc123"
}
```

## File Requirements

- **Supported Formats:** JPEG, JPG, PNG, WebP, GIF
- **Maximum File Size:** 5MB per file
- **Product Images:** Up to 10 images per upload
- **Collection Images:** 1 image per upload

## Image Transformations

### Product Images
- Width: 800px
- Height: 800px
- Crop: Fill
- Quality: Auto
- Format: Auto

### Collection Images
- Width: 600px
- Height: 600px
- Crop: Fill
- Quality: Auto
- Format: Auto

## Error Responses

### File Validation Errors
```json
{
  "success": false,
  "message": "Invalid file type: document.pdf. Only images are allowed.",
  "error": "Error details..."
}
```

### Authentication Errors
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Error details..."
}
```

## Integration with Product/Collection APIs

When creating or updating products/collections, use the returned URLs:

```javascript
// Upload images first
const uploadResponse = await fetch('/api/upload/product', {
  method: 'POST',
  body: formData
});
const { data: uploadedImages } = await uploadResponse.json();

// Create product with image URLs and public IDs
const productData = {
  name: "Woven Basket",
  images: uploadedImages.map(img => img.url),
  imagePublicIds: uploadedImages.map(img => img.public_id),
  // ... other product data
};

await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});
```

## Automatic Cleanup

When products or collections are deleted, their associated images are automatically removed from Cloudinary to prevent orphaned files. 