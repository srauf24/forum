import { useState } from 'react';

function AddBookForm({ onAddBook, onCancel }) {
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        totalPages: '',
        currentPage: '0',
        pagesPerDay: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newBook.title || !newBook.author) return;

        const today = new Date();
        const daysToFinish = Math.ceil((newBook.totalPages - newBook.currentPage) / (newBook.pagesPerDay || 1));
        const finishDate = new Date(today.setDate(today.getDate() + daysToFinish));

        const book = {
            ...newBook,
            description: `Manually added book: ${newBook.title} by ${newBook.author}`,
            genre: 'Unspecified',
            progress: {
                totalPages: parseInt(newBook.totalPages) || 0,
                currentPage: parseInt(newBook.currentPage) || 0,
                pagesPerDay: parseInt(newBook.pagesPerDay) || 0,
                startDate: new Date().toISOString(),
                estimatedFinishDate: finishDate.toISOString()
            }
        };

        onAddBook(book);
        setNewBook({
            title: '',
            author: '',
            totalPages: '',
            currentPage: '0',
            pagesPerDay: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Book Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={newBook.title}
                        onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 
              focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        placeholder="Enter book title..."
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                        Author
                    </label>
                    <input
                        type="text"
                        id="author"
                        value={newBook.author}
                        onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 
              focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        placeholder="Enter author name..."
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700">
                        Total Pages
                    </label>
                    <input
                        type="number"
                        id="totalPages"
                        value={newBook.totalPages}
                        onChange={(e) => setNewBook(prev => ({ ...prev, totalPages: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 
              focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        placeholder="Enter total pages..."
                        required
                        min="1"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="pagesPerDay" className="block text-sm font-medium text-gray-700">
                        Pages Per Day
                    </label>
                    <input
                        type="number"
                        id="pagesPerDay"
                        value={newBook.pagesPerDay}
                        onChange={(e) => setNewBook(prev => ({ ...prev, pagesPerDay: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 
              focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        placeholder="Enter pages per day..."
                        required
                        min="1"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white 
            rounded-full hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 
            shadow-lg hover:shadow-xl text-sm font-medium transform hover:scale-105"
                >
                    Add to Collection
                </button>
            </div>
        </form>
    );
}

export default AddBookForm;