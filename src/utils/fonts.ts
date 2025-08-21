import {Bricolage_Grotesque, Poppins} from "next/font/google";
import localFont from "next/font/local";

export const roboto = Poppins({
    weight: ['400', '700', '900'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    display: 'swap',
})
export const ZonaPro = localFont({
    src: [
        {
            path: "../public/fonts/ZonaPro-Bold.otf",
            style: "normal",
            weight: "700",
        },
        {
            path: "../public/fonts/ZonaPro-ExtraLight.otf",
            style: "normal",
            weight: "200",
        }
    ],
    variable: '--zonal-pro',
})

export const BricolageGrotesque = Bricolage_Grotesque({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-bricolage",
  });
  