
// Summary: This file contains the layout of the website. It includes the header, footer and the main content of the website.
import Header from '../Header/header.jsx';
import Footer from '../Footer/footer.jsx';
import Routers from '../../Router/routes.jsx';

const Layout = () => {
    return (
        <div>
            <Header />
            <div>
                <Routers />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;