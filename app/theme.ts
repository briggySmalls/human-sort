import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    initialColorMode: 'dark',
    fonts: {
        heading: 'var(--font-inter)',
        body: 'var(--font-inter)',
    }
});
