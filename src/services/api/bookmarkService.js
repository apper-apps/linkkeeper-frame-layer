import bookmarksData from "@/services/mockData/bookmarks.json";

class BookmarkService {
  constructor() {
    this.bookmarks = [...bookmarksData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.bookmarks];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const bookmark = this.bookmarks.find(b => b.Id === parseInt(id));
    return bookmark ? { ...bookmark } : null;
  }

  async scanBookmarks(onProgress) {
    const totalBookmarks = this.bookmarks.length;
    let scannedCount = 0;
    const duplicates = [];
    const deadLinks = [];
    const urlMap = new Map();

    // Find duplicates by normalizing URLs
    for (const bookmark of this.bookmarks) {
      const normalizedUrl = this.normalizeUrl(bookmark.url);
      
      if (urlMap.has(normalizedUrl)) {
        // This is a duplicate
        duplicates.push({ ...bookmark });
      } else {
        urlMap.set(normalizedUrl, bookmark);
      }
    }

    // Simulate scanning each bookmark with progress updates
    for (const bookmark of this.bookmarks) {
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
      
      // Add to dead links if marked as dead in mock data
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
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.bookmarks.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      this.bookmarks.splice(index, 1);
      return true;
    }
    return false;
  }

  async removeBulkBookmarks(ids) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const intIds = ids.map(id => parseInt(id));
    this.bookmarks = this.bookmarks.filter(b => !intIds.includes(b.Id));
    return true;
  }

  async create(bookmarkData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...this.bookmarks.map(b => b.Id), 0) + 1;
    const newBookmark = {
      Id: newId,
      dateAdded: new Date().toISOString(),
      status: "active",
      ...bookmarkData
    };
    this.bookmarks.push(newBookmark);
    return { ...newBookmark };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.bookmarks.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      this.bookmarks[index] = { ...this.bookmarks[index], ...updateData };
      return { ...this.bookmarks[index] };
    }
    return null;
  }

  async delete(id) {
    return this.removeBookmark(id);
  }
}

export const bookmarkService = new BookmarkService();