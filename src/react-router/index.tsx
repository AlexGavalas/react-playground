import {
    BrowserRouter,
    Link,
    Route,
    Routes,
    Outlet,
    useParams,
    useOutletContext,
} from 'react-router-dom';

const Home = () => <h1>Home</h1>;

const Books = () => <h1>Books</h1>;

const Book = () => {
    const { id } = useParams();
    const context = useOutletContext();

    return (
        <h1>
            Book {id} and outlet context is {JSON.stringify(context)}
        </h1>
    );
};

const NewBook = () => <h1>New book</h1>;

const BookLayout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/books/1">Book 1</Link>
                    </li>
                    <li>
                        <Link to="/books/2">Book 2</Link>
                    </li>
                    <li>
                        <Link to="/books/new">New book</Link>
                    </li>
                </ul>
            </nav>
            <Outlet context={{ answer: 42 }} />
        </>
    );
};

const Nav = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/books">Books</Link>
                </li>
            </ul>
        </nav>
    );
};

const NotFound = () => <h1>Not found</h1>;

const Router = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/books"
                    element={<p>Extra content for /books path</p>}
                />
            </Routes>
            <Nav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<BookLayout />}>
                    <Route index={true} element={<Books />} />
                    <Route path=":id" element={<Book />} />
                    <Route path="new" element={<NewBook />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export const App = () => {
    return (
        <BrowserRouter>
            <Router />
        </BrowserRouter>
    );
};
