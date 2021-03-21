import { AppLocalization } from 'src/app/common/LocaleRes';
import { AdvertService } from './shared/rom-advert/components/services/advert.service';
import {
  Component,
  Renderer2,
  ViewChild,
  AfterViewChecked,
  OnDestroy} from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { filter, pairwise } from 'rxjs/operators';

import { GlobalValues, AccessDirectiveConfig } from './core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent implements AfterViewChecked,  OnDestroy {
  advertData: any;
  constructor(
    private _router: Router,
    private advertService: AdvertService,
    private renderer: Renderer2  ) {
    GlobalValues.Instance.UrlHistory.saveRouter(this._router);

    this.router$ = this._router.events
      .pipe(
        filter((event: any) => event instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((e: any) => {
        GlobalValues.Instance.UrlHistory.saveUrlHistory(e);
      });

    this.advertService.getAdvert().subscribe(data => {
      this.advertData = data;
    });
  }

  get isLogin() {
    return this._router.url.includes('login');
  }

  public get isAuth(): boolean {
    return GlobalValues.Instance.userApp != null;
  }

  public get isPersonalArea(): boolean {
    let result = false;
    if (GlobalValues.Instance.userApp) {
      result = GlobalValues.Instance.userApp.IsPersonalArea;
    }
    return result;
  }
  selectedHeader: any;
  get notCustomTheme() {
    return localStorage.getItem('notCustomTheme') == null || localStorage.getItem('notCustomTheme') !== 'false';
  }
  router$: Subscription;
  @ViewChild('sidebar', { static: false }) sideBar: any;

  protected Title: string;

  Menu: any[] = [
    {
      url: '/hierarchy-main',
      title: AppLocalization.Hierarchies,
      visible: true,
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: ['HH_ALLOW', 'HH_ALLOW_PERSONAL']
      })
    },
    {
      url: '/journals/events',
      title: AppLocalization.EventJournal,
      visible: true,
      access: 'ES_EVENT_LOG_VIEW'
    },
    {
      url: '/objects',
      title: AppLocalization.Objects,
      visible: true,
      access: 'MAIN_OBJECT_LIST'
    },
    {
      title: AppLocalization.Label43,
      children: [
        {
          url: '/validation/queue',
          title: AppLocalization.DataAnalysis,
          visible: true,
          access: 'DA_ALLOW'
        },
        {
          url: '/reports/queue',
          title: AppLocalization.Reports,
          visible: true,
          access: 'DR_ALLOW'
        },
        {
          url: '/requests-module/requests-queue',
          title: AppLocalization.Requests,
          visible: true,
          access: ['DQ_ALLOW', 'DQ_VIEW_QUEUE']
        },
        {
          url: '/management-module/managements-queue',
          title: AppLocalization.Management,
          visible: true,
          access: ['CMD_ALLOW', 'CMD_VIEW_QUEUE']
        }
      ],
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: [
          'DA_ALLOW',
          'DR_ALLOW',
          'DQ_ALLOW',
          'CMD_ALLOW',
          'DQ_VIEW_QUEUE',
          'CMD_VIEW_QUEUE'
        ]
      })
    },
    {
      url: '/schedule-module/schedules',
      title: AppLocalization.Schedule,
      visible: true,
      access: 'SDL_ALLOW'
    },
    {
      url: '/personal-account',
      title: AppLocalization.PersonalOffice,
      visible: true,
      access: 'PA_ALLOW'
    },
    {
      title: AppLocalization.PersonalAccountOffice,
      visible: true,
      children: [
        {
          url: '/sub-personal-account/apps',
          visible: true,
          title: AppLocalization.ApplicationList,
          access: 'CPA_VIEW_APPS'
        },
        {
          url: '/sub-personal-account/subscribers',
          visible: true,
          title: AppLocalization.CustomerList,
          access: 'CPA_VIEW_CUSTOMERS'
        },
        {
          url: '/sub-personal-account/documents',
          visible: true,
          title: AppLocalization.DocumentList,
          access: 'CPA_VIEW_DOCUMENTS'
        },
        {
          url: '/sub-personal-account/request',
          title: AppLocalization.Requests,
          visible: true,
          access: 'CPA_VIEW_REQUESTS'       
        },
      ],
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: [
          'CPA_ALLOW',
          'CPA_VIEW_APPS',
          'CPA_VIEW_CUSTOMERS',
          'CPA_VIEW_DOCUMENTS',
          'CPA_VIEW_REQUESTS'
        ]
      })
    },
    {
      title: AppLocalization.References,
      children: [
        {
          url: '/references/subsystems',
          title: AppLocalization.Subsystems,
          visible: true,
          access: 'REF_VIEW_SUBSYSTEMS'
        },
        {
          url: '/references/address-book',
          title: AppLocalization.AddressBook,
          visible: true,
          access: 'REF_VIEW_ADDRESS_BOOK'
        },
        {
          url: '/references/geography',
          title: AppLocalization.Geography,
          visible: true,
          access: 'REF_VIEW_GEOGRAPHY'
        },
        {
          url: '/references/filter-references',
          title: AppLocalization.TaggingFilters,
          visible: true,
          access: 'CFG_TAG_FILTERS_VIEW'
        },
        {
          url: '/references/types-requests',
          title: AppLocalization.TypesOfQueries,
          visible: true,
          access: 'REF_VIEW_QUERIES'
        },
        {
          url: '/references/device-channel-types',
          title: AppLocalization.ChannelTypes,
          visible: true,
          access: 'REF_VIEW_CHANNELS'
        },
        {
          url: '/references/device-property-types',
          title: AppLocalization.DevicePropertyTypes,
          visible: true,
          access: 'REF_VIEW_DEVICE_PROPERTIES'
        },
        {
          url: '/references/logic-device-property-types',
          title: AppLocalization.TypesOfHardwareProperties,
          visible: true,
          access: 'REF_VIEW_LOGIC_DEVICE_PROPERTIES'
        },
        {
          url: '/references/types-logic-devices',
          title: AppLocalization.EquipmentTypes,
          visible: true,
          access: 'CFG_LOGIC_DEVICE_VIEW'
        },
        {
          url: '/references/logic-tag-types',
          title: AppLocalization.EquipmentTagTypes,
          visible: true,
          access: 'REF_VIEW_LOGIC_DEVICE_TAGS'
        }
      ],
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: [
          'REF_VIEW_SUBSYSTEMS',
          'REF_VIEW_ADDRESS_BOOK',
          'CFG_TAG_FILTERS_VIEW',
          'REF_VIEW_GEOGRAPHY',
          'REF_VIEW_QUERIES',
          'REF_VIEW_CHANNELS',
          'REF_VIEW_DEVICE_PROPERTIES',
          'REF_VIEW_LOGIC_DEVICE_PROPERTIES',
          'CFG_LOGIC_DEVICE_VIEW',
          'REF_VIEW_LOGIC_DEVICE_TAGS'
        ]
      })
    },
    {
      title: AppLocalization.Settings,
      children: [
        {
          url: '/hierarchies-module/hierarchies',
          title: AppLocalization.Hierarchies,
          visible: true,
          access: 'HH_SETTINGS'
        },
        {
          url: '/commands-module/bounds',
          title: AppLocalization.TypesOfRestrictions,
          visible: true,
          access: 'CFG_TAG_BOUNDS_VIEW'
        },
        {
          url: '/commands-module/notifications',
          title: AppLocalization.SetUpAlerts,
          visible: true,
          access: 'ES_NTF_VIEW'
        },
        {
          url: '/commands-module/types-devices',
          title: AppLocalization.TypesOfDevices,
          visible: true,
          access: 'CFG_DEVICE_VIEW'
        },
        {
          url: '/commands-module/command-types',
          title: AppLocalization.DeviceCommandTypes,
          visible: true,
          access: 'REF_DEVICE_VIEW_COMMANDS'
        },
        {
          url: '/commands-module/types-commands-logic-devices',
          title: AppLocalization.TypesOfEquipmentCommands,
          visible: true,
          access: 'REF_LOGIC_DEVICE_VIEW_COMMANDS'
          },
        {
          url: '/script-editors',
          title: AppLocalization.ScriptEditor,
          visible: true,
          access: 'REF_VIEW_SCRIPTS'
        },
      ],
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: [
          'HH_SETTINGS', 
          'CFG_DEVICE_VIEW', 
          'REF_DEVICE_VIEW_COMMANDS',
          'REF_LOGIC_DEVICE_VIEW_COMMANDS',
          'CFG_TAG_BOUNDS_VIEW',
          'ES_NTF_VIEW',
          'REF_VIEW_SCRIPTS'
        ]
      })
    },
    {
      title: AppLocalization.AdministrativeMenuItem,
      children: [
        {
          url: '/admin/users',
          title: AppLocalization.Users,
          visible: true,
          access: 'ADM_USERS_ALLOW'
        },

        {
          url: '/admin/groups/main',
          title: AppLocalization.Groups,
          visible: true,
          access: 'ADM_GROUPS_ALLOW'
        },
        {
          url: '/access',
          title: AppLocalization.Modules,
          visible: true,
          access: 'ADM_GROUPS_ALLOW'
        }
      ],
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: ['ADM_USERS_ALLOW', 'ADM_GROUPS_ALLOW', 'ADM_GROUPS_ALLOW']
      })
    },
    {
      title: AppLocalization.Label121,
      children: [
        {
          url: '/import-export/references/ref-upload',
          title: AppLocalization.ImportGuides,
          visible: true,
          access: 'EI_REF_IMPORT'
        },
        {
          url: '/import-export/references/export',
          title: AppLocalization.Label122,
          visible: true,
          access: 'EI_REF_EXPORT'
        }
      ],
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: ['EI_REF_IMPORT', 'EI_REF_EXPORT']
      })
    },
    {
      title: AppLocalization.PropertyUpdate,
      children: [
        {
          url: '/property-update/export-import/queue',
          title: AppLocalization.ExportsAndImports,
          access: 'CMG_EXPORT_IMPORT_VIEW_QUEUE'
        }
      ],
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: ['CMG_EXPORT_IMPORT_VIEW_QUEUE']
      })
    },
    {
      title: AppLocalization.TariffCalculator,
      children: [
        {
          url: '/tariff-calculator/main/queue',
          title: AppLocalization.Queue,
          access: 'TC_VIEW_QUEUE'
        },        
        {
          url: '/tariff-calc/export-import/queue',
          title: AppLocalization.Label121,
          access: 'TC_EXPORT_IMPORT_VIEW_QUEUE'
        },
        {
          url: '/tariff-calc/suppliers',
          title: AppLocalization.GuaranteeingSuppliers,
          visible: true,
          access: 'TC_SUPPLIER_VIEW'
        },
        {
          url: '/tariff-calculator/max-power',
          title: AppLocalization.MaximumCapacity,
          visible: true,
          access: 'TC_MAX_POWER_VIEW'
        },
        {
          url: '/tariff-calculator/agreement-types',
          title: AppLocalization.ContractTypes,
          visible: true,
          access: 'TC_AGREEMENT_TYPE_VIEW'
        },
        {
          url: '/tariff-calculator/power-levels',
          title: AppLocalization.StressLevels,
          visible: true,
          access: 'TC_POWER_LEVEL_VIEW'
        },
        {
          url: '/tariff-calculator/price-zones',
          title: AppLocalization.Label115,
          visible: true,
          access: 'TC_PRICE_ZONE_VIEW'
        },
        {
          url: '/tariff-calculator/oeses',
          title: AppLocalization.Eco,
          visible: true,
          access: 'TC_OES_VIEW'
        },
        {
          url: '/tariff-calculator/regions',
          title: AppLocalization.Regions,
          visible: true,
          access: 'TC_REGION_VIEW'
        },
        {
          url: '/tariff-calculator/supply-org-types',
          title: AppLocalization.NetworkOrganizations,
          visible: true,
          access: 'TC_SUPPLY_ORGANIZATION_VIEW'
        },
      ],
      access: Object.assign(new AccessDirectiveConfig(), {
        arrayOperator: 'Or',
        value: [
          'TC_PRICE_ZONE_VIEW', 
          'TC_OES_VIEW',
          'TC_REGION_VIEW',
          'TC_POWER_LEVEL_VIEW',
          'TC_AGREEMENT_TYPE_VIEW',
          'TC_MAX_POWER_VIEW',
          'TC_SUPPLIER_VIEW',
          'TC_SUPPLY_ORGANIZATION_VIEW',
          'TC_EXPORT_IMPORT_VIEW_QUEUE',          
          'TC_VIEW_QUEUE'
        ]
      })
    }
  ];

  ngAfterViewChecked() {
    this.highlightSelectedNav();
  }

  ngOnDestroy() {
    if (this.router$) {
      this.router$.unsubscribe();
    }
  }

  getMenu() {
    return this.Menu;
  }

  highlightSelectedNav() {
    if (!(this.isAuth && !this.isPersonalArea && !this.isLogin)) {
      return;
    }

    if (this.selectedHeader) {
      this.renderer.removeClass(this.selectedHeader, 'selected-header');
    }
    const parentLists = Array.from(this.sideBar.nativeElement.children);
    parentLists.find((li: any) => {
      const header = li.children[0];
      if (li.children.length < 2) {
        return false;
      }
      const collapsedChildren = li.children[1].children;
      for (let i = 0; i < collapsedChildren.length; i++) {
        if (collapsedChildren[i].className.includes('nav-child-item active')) {
          this.selectedHeader = header;
          this.renderer.addClass(this.selectedHeader, 'selected-header');
          return true;
        }
      }
      return false;
    });
  }

  public exitApplication() {
    this._router.navigate(['login'], { queryParamsHandling: 'preserve' });
  }
}
