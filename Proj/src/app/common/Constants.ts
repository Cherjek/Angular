import { AppLocalization } from 'src/app/common/LocaleRes';
import * as Localization from './Localization';


// tslint:disable
export module Common {
    import Locale = Localization.Common.Localization;

    export class Constants {

        //DATE TIME CONSTANTS
        public static readonly DATE_FMT_DELIMITER = '.';
        public static readonly DATE_FMT = `YYYY${Constants.DATE_FMT_DELIMITER}MM${Constants.DATE_FMT_DELIMITER}DD`;
        public static readonly DATE_FMT_YEAR_MONTH = `YYYY${Constants.DATE_FMT_DELIMITER}MM`;
        public static readonly TIME_FMT = 'HH:mm';
        public static readonly DATE_TIME_FMT = `${Constants.DATE_FMT} ${Constants.TIME_FMT}`;
        public static readonly CALENDAR_RU = {
            firstDayOfWeek: 1,
            dayNames: [
                Locale.Calendar.DayWeeks.Sunday,
                Locale.Calendar.DayWeeks.Monday,
                Locale.Calendar.DayWeeks.Tuesday,
                Locale.Calendar.DayWeeks.Wednesday,
                Locale.Calendar.DayWeeks.Thursday,
                Locale.Calendar.DayWeeks.Friday,
                Locale.Calendar.DayWeeks.Saturday                                
            ],
            dayNamesShort: Locale.Calendar.DayWeeksShort,
            dayNamesShortAlt: Locale.Calendar.DayWeeksShortAlt,
            monthNames: [
                Locale.Calendar.Month.January,
                Locale.Calendar.Month.February,
                Locale.Calendar.Month.March,
                Locale.Calendar.Month.April,
                Locale.Calendar.Month.May,
                Locale.Calendar.Month.June,
                Locale.Calendar.Month.July,
                Locale.Calendar.Month.August,
                Locale.Calendar.Month.September,
                Locale.Calendar.Month.October,
                Locale.Calendar.Month.November,
                Locale.Calendar.Month.December
            ],
            monthNamesShort: Constants.getMonthsShortName()
        };
        private static cutString(length: number, val: string): string {
            return val.substring(0, length);
        }
        private static getMonthsShortName(): string[] {
            let results: string[] = [];

            let keys = Object.keys(Locale.Calendar.Month);
            for (let i = 0; i < keys.length; i++) {
                let item = Locale.Calendar.Month[keys[i]];
                results.push(Constants.cutString(3, item));
            }

            return results;
        }

        //MAPS CONSTANTS
        public static readonly MAP_CENTER_DEFAULT = {
            LAT: 55.76,
            LON: 37.62
        }

        //NAME STATUS ERROR
        public static readonly NAME_STATUS_ERROR = 'Failed';

        //ФОРМАТ ЧИСЛА ВЫВОДИМОГО ЧЕРЕЗ PIPE decimalFormat, отображение дробного числа
        public static readonly DECIMAL_FORMAT = {
            FRACTIONAL_SEPARATOR: '.',//разделение целой и дробной части
            THOUSAND_DELIMETER: ' ',//разделение тысячных
            FRACTIONAL_WIDTH: 3//число знаков дробных
        };

        public static readonly NO_NAME = AppLocalization.WithoutName;

        public static readonly ADMIN_MODULE = {
            statuses_names: {
                active: AppLocalization.Yes,
                notActive: AppLocalization.No
            },
            auth_types: {
                authType1: "RMon4",
                authType2: "Ldap",
            }
        };

        public static readonly HIERARCHY_SESSION_KEY = 'CONSTANTS.sessionHierarchySelect';
        public static readonly STORAGE_USER_APP_KEY = 'Common.GlobalValues.storageUserApp';

        public static readonly NAVIGATION_MENU_QUEUE = [
            {
                code: 'validation',
                url: 'validation/queue',
                name: AppLocalization.DataAnalysis,
                access: 'DA_ALLOW'
            },
            {
                code: 'reports',
                url: 'reports/queue',
                name: AppLocalization.Reports,
                access: 'DR_ALLOW'
            },
            {
                code: 'requests',
                url: 'requests-module/requests-queue',
                name: AppLocalization.Requests,
                access: ['DQ_ALLOW', 'DQ_VIEW_QUEUE']
            },
            {
                code: 'management',
                url: 'management-module/managements-queue',
                name: AppLocalization.Management,
                access: ['CMD_ALLOW', 'CMD_VIEW_QUEUE']
            }
        ];

        /**
         * For Title Bar
         */
        public static readonly ModulePaths = {
            DataAnalysis: AppLocalization.DataAnalysis,
            Objects: AppLocalization.Objects,
            DataAnalysisResult: AppLocalization.DataAnalizeResult,
            Reports: AppLocalization.Reports,
            ReportsQueue: AppLocalization.ReportingQueue,
            ReportResult: AppLocalization.Label42,
            DataPresentation: AppLocalization.DataPresentation,
            ObjectCard: AppLocalization.ObjectCard,
            LogicDeviceCard: AppLocalization.EquipmentCard,
            TagsSort: AppLocalization.Label101,
            TagsEdit: AppLocalization.Label100,
            Devices: AppLocalization.Label110,
            DevicesCard: AppLocalization.DeviceCard,
            Test: 'Test',
            Admin: AppLocalization.Administrative,
            PersonalAccount: AppLocalization.PersonalOffice,
            Hierarchy: AppLocalization.Hierarchies,
            MainWindow: AppLocalization.MainWindow,
            Request: AppLocalization.Request,
            RequestsQueue: AppLocalization.RequestQueue,
            RequestResult: AppLocalization.RequestResult,
            Schedules: AppLocalization.Schedule,
            TypesDevices: AppLocalization.TypesOfDevices,
            TypesCommandsLogicDevices: AppLocalization.TypesOfEquipmentCommands,
            CommandTypes: AppLocalization.DeviceCommandTypes,
            AddressBook: AppLocalization.AddressBook,
            TagValueBounds: AppLocalization.TypesOfRestrictions,
            Notifications: AppLocalization.Alerts,
            LogicDeviceCommand: AppLocalization.EquipmentTeam,
            CommandDevices: AppLocalization.DeviceTeam,
            Management: AppLocalization.Management,
            TypesRequests: AppLocalization.TypesOfQueries,
            ChannelTypes: AppLocalization.ChannelTypes,
            DevicePropertyTypes: AppLocalization.DevicePropertyTypes,
            LogicDevicePropertyTypes: AppLocalization.TypesOfHardwareProperties,
            LogicTagTypes: AppLocalization.EquipmentTagTypes,
            TypesLogicDevices: AppLocalization.EquipmentTypes,
            Geography: AppLocalization.Geography,
            SubSystems: AppLocalization.Subsystems,
            ReferenceFilter: AppLocalization.FilterCard,
            MaxPowerTypes: AppLocalization.MaximumCapacity,
            AgreementTypes: AppLocalization.ContractTypes,
            PowerLevelTypes: AppLocalization.StressLevels,
            PriceZones: AppLocalization.Label115,
            Oes: AppLocalization.Eco,
            Regions: AppLocalization.Regions,
            Transfers: AppLocalization.BoilerRates,
            TariffCalc: AppLocalization.TariffCalculator,
            NotFound: AppLocalization.NotFound,
            FilterReference: AppLocalization.TaggingFilters,
            JournalEvents: AppLocalization.EventJournal,
            ScriptEditor: AppLocalization.ScriptEditor,
            SubPersonalAccount: AppLocalization.PersonalAccountOffice,
            Suppliers: AppLocalization.GuaranteeingSuppliers,
            Supplier: AppLocalization.GuaranteeingSupplier,
            UPExportImportQueue: AppLocalization.Label29,
            UPExportImportResult: AppLocalization.Label30,
            UPExportImportCreate: AppLocalization.Label31,
            UPExportImportChoiceProperty: AppLocalization.Label28,
            UPExportImportChoiceUnits: AppLocalization.Label27
        }

        public ReferenceGroups = [
            { Id: 1, Name: AppLocalization.Macroregions, Code: 'MacroRegions' },
        
            { Id: 2, Name: AppLocalization.TypesOfQueries, Code: 'DataQueryTypes' },
        
            { Id: 3, Name: AppLocalization.ChannelTypes, Code: 'DeviceChannelTypes' },
        
            { Id: 4, Name: AppLocalization.DevicePropertyTypes, Code: 'DevicePropertyTypes' },
        
            {
              Id: 5,
              Name: AppLocalization.TypesOfHardwareProperties,
              Code: 'LogicDevicePropertyTypes'
            },
        
            { Id: 6, Name: AppLocalization.EquipmentTagTypes, Code: 'LogicTagTypes' },
        
            { Id: 7, Name: AppLocalization.DeviceCommandTypes, Code: 'DeviceCommandTypes' },
        
            {
              Id: 8,
              Name: AppLocalization.TypesOfEquipmentCommands,
              Code: 'LogicDeviceCommandTypes'
            },
        
            { Id: 9, Name: AppLocalization.TypesOfDevices, Code: 'DeviceTypes' },
        
            { Id: 10, Name: AppLocalization.EquipmentTypes, Code: 'LogicDeviceTypes' }
          ];
    }
}