import React from 'react'
import * as BooksAPI from '../BooksAPI'

class BookShelf extends React.Component {
    state = {
        books: []
    }

    componentDidMount() {
        BooksAPI.getAll()
            .then(books => {
                this.setState({ books: books })
            })
    }

    onShelfUpdate = (book, shelfName) => {
        const { books } = this.state
        console.log(books);
        const updateIndex = books.findIndex(b => b.id === book.id)
        const updateBook = books[updateIndex]
        updateBook.shelf = shelfName

        this.setState({
            books: [...books.slice(0, updateIndex), updateBook, ...books.slice(updateIndex + 1)]
        })

        BooksAPI.update(book, shelfName)
    }

    render() {

        const noCoverImage = '../no_cover_thumb.gif'

        const shelf = [{
            title: 'Currently Reading',
            content: this.state.books.filter((book) => book.shelf === 'currentlyReading')
        }, {
            title: 'Want to Read',
            content: this.state.books.filter((book) => book.shelf === 'wantToRead')
        }, {
            title: 'Read',
            content: this.state.books.filter((book) => book.shelf === 'read')
        }]

        return (
            <div className="list-books-content">
                <div>
                    {shelf.map((item, index) => (
                        <div className="bookshelf" key={index}>
                            <h2 className="bookshelf-title">{item.title}</h2>
                            <div className="bookshelf-books">
                                <ol className="books-grid">
                                    {item.content.length > 0 ? (item.content.map((book, index) => (
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
                                    ))) : (<p>No Books in this shelf</p>)}
                                </ol>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
export default BookShelf