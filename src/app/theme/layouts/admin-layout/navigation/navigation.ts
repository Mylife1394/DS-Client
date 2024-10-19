export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'setting',
    title: 'Setting',
    type: 'group',
    icon: 'setting-outlined',
    children: [
      {
        id: 'users',
        title: 'Users',
        type: 'item',
        classes: 'nav-item',
        url: '/setting/users',
        icon: 'user',
        breadcrumbs: false
      },
      {
        id: 'groups',
        title: 'Groups',
        type: 'item',
        classes: 'nav-item',
        url: '/setting/groups',
        icon: 'group',
        breadcrumbs: false
      },
      {
        id: 'sensorTypes',
        title: 'SensorType',
        type: 'item',
        classes: 'nav-item',
        url: '/setting/sensorTypes',
        icon: 'group',
        breadcrumbs: false
      },
      {
        id: 'localization-string',
        title: 'LocalizationString',
        type: 'item',
        classes: 'nav-item',
        url: '/setting/localizationString',
        icon: 'group',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Map',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'map',
        breadcrumbs: false
      },
      {
        id: 'default',
        title: 'SensorLog',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/sensor-log',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  }
];
