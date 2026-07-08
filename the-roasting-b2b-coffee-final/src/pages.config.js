import Connect from './pages/Connect';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import Products from './pages/Products';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Connect": Connect,
    "Home": Home,
    "OurStory": OurStory,
    "Products": Products,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};