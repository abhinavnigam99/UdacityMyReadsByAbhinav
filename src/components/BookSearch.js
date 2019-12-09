import React from 'react'
import * as BooksAPI from '../BooksAPI'
import { Link } from "react-router-dom";

class BookSearch extends React.Component {

    state = {
        booksOnShelf: [],
        booksOnSearch: [],
        query: ''
    }

    componentDidMount() {
        BooksAPI.getAll()
            .then(books => {
                this.setState({
                    booksOnShelf: books.filter(book => book.shelf !== 'none')
                })
            })
    }

    onShelfUpdate = (book, shelfName) => {
        BooksAPI.update(book, shelfName)
        const { booksOnSearch } = this.state
        console.log(booksOnSearch);
        const updateIndex = booksOnSearch.findIndex(b => b.id === book.id)
        const updateBook = booksOnSearch[updateIndex]
        updateBook.shelf = shelfName

        this.setState({
            booksOnSearch: [...booksOnSearch.slice(0, updateIndex), updateBook, ...booksOnSearch.slice(updateIndex + 1)]
        })
    }

    searchBooks(query) {
        const { booksOnShelf } = this.state
        this.setState({ query });
        if (query) {
            BooksAPI.search(query).then((results) => {
                if (results && results.length > 0) {
                    let searchResult = results;
                    searchResult.map((book) => book.shelf = 'none');
                    booksOnShelf.map((book) => {
                        const updateIndex = searchResult.findIndex(s => s.id === book.id);
                        if (searchResult[updateIndex]) {
                            searchResult[updateIndex].shelf = book.shelf
                        }
                    });
                    this.setState({
                        booksOnSearch: searchResult
                    })
                }
                else {
                    this.setState({ booksOnSearch: [] })
                }
            })
        }
        else {
            this.setState({ booksOnSearch: [] })
        }
    }

    render() {
        const { booksOnSearch, query } = this.state
        const noCoverImage = '../no_cover_thumb.gif'
        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/'>
                        <button className="close-search">Close</button>
                    </Link>
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            onChange={(e) => this.searchBooks(e.target.value)} />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        <ol className="books-grid">
                            {booksOnSearch.length > 0 ? (booksOnSearch.map((book, index) => (
                                <li key={index}>
                                    <div className="book">
                                        <div className="book-top">
                                            <div className="book-cover"
                                                style={{
                                                    width: 128,
                                                    height: 193,
                                                    backgroundImage: `url(${book.imageLinks ? book.imageLinks.thumbnail : noCoverImage})`
                                                }}>
                                            </div>
                                            <div className="book-shelf-changer">
                                                <select value={book.shelf} onChange={e => this.onShelfUpdate(book, e.target.value)}>
                                                    <option value="move" disabled>Move to...</option>
                                                    <option value="currentlyReading">Currently Reading</option>
                                                    <option value="wantToRead">Want to Read</option>
                                                    <option value="read">Read</option>
                                                    <option value="none">None</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="book-title">{book.title ? book.title : ''}</div>
                                        <div className="book-authors">{book.authors ? book.authors.join(', ') : ''}</div>
                                    </div>
                                </li>
                            ))) : (query.length === 0 ?
                                (<p>No query entered</p>) :
                                (<p>No Results Found</p>))
                            }
                        </ol>
                    </ol>
                </div>
            </div>
        )
    }
}
export default BookSearch