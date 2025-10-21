"use client";
import { useState, useEffect } from "react";
import PageLayout from "@/components/utils/PageLayout";
import { getAllCollections } from "@/data/photoCollections";

const GalleryIndex = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    // Get all published collections
    const allCollections = getAllCollections();
    const publishedCollections = allCollections.filter((collection) => collection.status === "published");
    setCollections(publishedCollections);
    setFilteredCollections(publishedCollections);
  }, []);

  useEffect(() => {
    let filtered = collections;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (collection) =>
          collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          collection.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((collection) => {
        const title = collection.title.toLowerCase();
        switch (selectedCategory) {
          case "wedding":
            return title.includes("wedding");
          case "portrait":
            return title.includes("portrait") || title.includes("family") || title.includes("engagement");
          case "event":
            return title.includes("event") || title.includes("corporate") || title.includes("graduation");
          case "other":
            return (
              !title.includes("wedding") &&
              !title.includes("portrait") &&
              !title.includes("family") &&
              !title.includes("engagement") &&
              !title.includes("event") &&
              !title.includes("corporate") &&
              !title.includes("graduation")
            );
          default:
            return true;
        }
      });
    }

    setFilteredCollections(filtered);
  }, [collections, searchTerm, selectedCategory]);

  const categories = [
    { id: "all", name: "All Collections" },
    { id: "wedding", name: "Wedding" },
    { id: "portrait", name: "Portrait & Family" },
    { id: "event", name: "Events & Corporate" },
    { id: "other", name: "Other" },
  ];

  const PhotoModal = ({ collection, onClose }) => {
    if (!collection) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{collection.title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              {collection.customerName} • {new Date(collection.date).toLocaleDateString()} • {collection.totalPhotos}{" "}
              photos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collection.mediaList
                ?.filter((media) => media.type === "photo")
                .map((photo) => (
                  <div key={photo.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-900 text-sm">{photo.title}</h4>
                      <p className="text-gray-600 text-xs">{photo.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      {/* Gallery Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our collection of beautiful moments captured through the lens
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-gray-600">
                  Showing {filteredCollections.length} of {collections.length} collections
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCollection(collection)}
                  >
                    {/* Collection Preview */}
                    <div className="aspect-video bg-gray-200 relative">
                      {collection.mediaList && collection.mediaList.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1 p-2">
                          {collection.mediaList
                            .filter((media) => media.type === "photo")
                            .slice(0, 4)
                            .map((photo, index) => (
                              <div key={photo.id} className="aspect-square bg-gray-300 rounded overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg
                                    className="w-6 h-6 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                </div>
                              </div>
                            ))}
                          {collection.mediaList.filter((media) => media.type === "photo").length < 4 && (
                            <div className="aspect-square bg-gray-300 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                +
                                {collection.totalPhotos -
                                  collection.mediaList.filter((media) => media.type === "photo").length}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Collection Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{collection.title}</h3>
                      <p className="text-gray-600 mb-3">{collection.customerName}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{new Date(collection.date).toLocaleDateString()}</span>
                        <span>{collection.totalPhotos} photos</span>
                      </div>
                      <button className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                        View Collection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Photo Modal */}
      {selectedCollection && (
        <PhotoModal collection={selectedCollection} onClose={() => setSelectedCollection(null)} />
      )}
    </PageLayout>
  );
};

export default GalleryIndex;
