import React from 'react'
import './App.css'
import BookShelf from './components/BookShelf'
import BookSearch from './components/BookSearch'
import { Route, Link } from "react-router-dom";


class BooksApp extends React.Component {
  state = {
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>Abhinav's Book Library</h1>
            </div>
            <BookShelf />
            <div className="open-search">
              <Link to='/search'>
                <button>Add a book</button>
              </Link>
            </div>
          </div>
        )} />
        <Route exact path='/search' render={({ history }) => (
          <BookSearch />
        )} />
      </div>
    )
  }
}

export default BooksApp
