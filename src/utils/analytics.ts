import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-7F5MXCYZ7W");
};

export const trackPage = (page: string) => {
  ReactGA.send({
    hitType: "pageview",
    page,
  });
};

export const trackEvent = (
  category: string,
  action: string,
  label?: string
) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};