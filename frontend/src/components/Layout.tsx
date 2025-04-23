
import { Box, Container } from "@chakra-ui/react";
import { ReactNode } from "react";
import Header from "./Header";
import { useLocation } from "react-router-dom";

interface LayoutProps {
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    const location = useLocation();
    const locationsWithoutHeader = ["/", "/login", "/register"]
    return (
        <Container pt={0}>
            { !locationsWithoutHeader.includes(location.pathname) && <Header />}
            <Box as="main" maxWidth={1280} alignContent="center" margin="auto">
                {children}
            </Box>
        </Container>
    );
};

export default Layout;