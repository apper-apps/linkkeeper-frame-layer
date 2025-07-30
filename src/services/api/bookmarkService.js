import { toast } from "react-toastify";

class BookmarkService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'bookmark';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "url" } },
          { field: { Name: "folder" } },
          { field: { Name: "dateAdded" } },
          { field: { Name: "status" } }
        ],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching bookmarks:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching bookmarks:", error.message);
        toast.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "url" } },
          { field: { Name: "folder" } },
          { field: { Name: "dateAdded" } },
          { field: { Name: "status" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching bookmark with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching bookmark with ID ${id}:`, error.message);
      }
      return null;
    }
  }

  async scanBookmarks(onProgress) {
    try {
      // First, get all bookmarks
      const bookmarks = await this.getAll();
      const totalBookmarks = bookmarks.length;
      let scannedCount = 0;
      const duplicates = [];
      const deadLinks = [];
      const urlMap = new Map();

      // Find duplicates by normalizing URLs
      for (const bookmark of bookmarks) {
        const normalizedUrl = this.normalizeUrl(bookmark.url);
        
        if (urlMap.has(normalizedUrl)) {
          // This is a duplicate
          duplicates.push({ ...bookmark });
        } else {
          urlMap.set(normalizedUrl, bookmark);
        }
      }

      // Simulate scanning each bookmark with progress updates
      for (const bookmark of bookmarks) {
        if (onProgress) {
          onProgress({
            progress: (scannedCount / totalBookmarks) * 100,
            currentUrl: bookmark.url,
            totalBookmarks,
            scannedCount
          });
        }

        // Simulate checking if link is dead
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        
        // Add to dead links if marked as dead in database
        if (bookmark.status === "dead") {
          deadLinks.push({ ...bookmark });
        }

        scannedCount++;
      }

      // Final progress update
      if (onProgress) {
        onProgress({
          progress: 100,
          currentUrl: "",
          totalBookmarks,
          scannedCount
        });
      }

      return {
        totalScanned: totalBookmarks,
        duplicates,
        deadLinks,
        scanDuration: scannedCount * 150, // Approximate scan time
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error scanning bookmarks:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error scanning bookmarks:", error.message);
        toast.error(error.message);
      }
      return {
        totalScanned: 0,
        duplicates: [],
        deadLinks: [],
        scanDuration: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  normalizeUrl(url) {
    try {
      const urlObj = new URL(url);
      // Remove trailing slash and convert to lowercase
      let normalized = urlObj.origin + urlObj.pathname;
      if (normalized.endsWith("/") && normalized.length > urlObj.origin.length + 1) {
        normalized = normalized.slice(0, -1);
      }
      // Add search params if they exist
      if (urlObj.search) {
        normalized += urlObj.search;
      }
      return normalized.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  async removeBookmark(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete bookmark ${failedDeletions.length} records: ${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing bookmark:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error removing bookmark:", error.message);
        toast.error(error.message);
      }
      return false;
    }
  }

  async removeBulkBookmarks(ids) {
    try {
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete bookmarks ${failedDeletions.length} records: ${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return failedDeletions.length === 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing bookmarks:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error removing bookmarks:", error.message);
        toast.error(error.message);
      }
      return false;
    }
  }

  async create(bookmarkData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: bookmarkData.Name || bookmarkData.title || "Untitled Bookmark",
          Tags: bookmarkData.Tags || "",
          Owner: bookmarkData.Owner || null,
          title: bookmarkData.title || "Untitled Bookmark",
          url: bookmarkData.url,
          folder: bookmarkData.folder || "Other Bookmarks",
          dateAdded: bookmarkData.dateAdded || new Date().toISOString(),
          status: bookmarkData.status || "active"
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create bookmarks ${failedRecords.length} records: ${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating bookmark:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating bookmark:", error.message);
        toast.error(error.message);
      }
      return null;
    }
  }

  async update(id, updateData) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.Name !== undefined && { Name: updateData.Name }),
          ...(updateData.Tags !== undefined && { Tags: updateData.Tags }),
          ...(updateData.Owner !== undefined && { Owner: updateData.Owner }),
          ...(updateData.title !== undefined && { title: updateData.title }),
          ...(updateData.url !== undefined && { url: updateData.url }),
          ...(updateData.folder !== undefined && { folder: updateData.folder }),
          ...(updateData.dateAdded !== undefined && { dateAdded: updateData.dateAdded }),
          ...(updateData.status !== undefined && { status: updateData.status })
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update bookmarks ${failedUpdates.length} records: ${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating bookmark:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating bookmark:", error.message);
        toast.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    return this.removeBookmark(id);
  }
}

export const bookmarkService = new BookmarkService();