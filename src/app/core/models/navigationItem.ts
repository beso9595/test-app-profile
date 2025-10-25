export interface NavigationItem {
  title: string;
  route: string;
  showWhenLoggedIn?: boolean;
  queryParams?: { [key: string]: string | number | boolean };
}
