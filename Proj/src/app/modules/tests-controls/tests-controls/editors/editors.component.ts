import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CalendarPickerType } from 'src/app/controls/CalendarPicker/calendar-picker-ro5.component';

@Component({
  selector: 'rom-editors',
  templateUrl: './editors.component.html',
  styleUrls: ['./editors.component.less']
})
export class EditorsComponent implements OnInit {

  radioCheckItems = [ { id: 1, name: 'Выбор 1' }, { id: 2, name: 'Выбор 2' }, { id: 3, name: 'Выбор 3' } ];
  radioCheckIndex = 0;

  comboBoxValue: any;
  comboBoxItems: any[];

  valuesChips = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
    'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
    'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  
  minDate = new Date(2019, 10, 1);
  maxDate = new Date(2020, 11, 31);
  fromDate = new Date();
  fromDate2 = new Date();
  fromDate3 = new Date();

  calendarPickerTypes = CalendarPickerType;

  constructor() { }

  ngOnInit() {
    
  }

  eventCellComboboxDropDown() {
    of(this.radioCheckItems)
      .pipe(
        delay(2000)
      )
      .subscribe(data => this.comboBoxItems = this.radioCheckItems)
  }
}
