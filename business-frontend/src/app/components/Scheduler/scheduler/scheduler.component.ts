import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  ViewEncapsulation,
  OnInit
} from '@angular/core';

import { RouteEvent } from '../../../models/Warehousing/RouteEvent/route-event'

import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek, addHours, startOfDay } from 'date-fns';
import localeHu from '@angular/common/locales/hu'
import { registerLocaleData } from '@angular/common';
import { CalendarEventService } from 'src/app/services/Warehousing/CalendarEvent/calendar-event.service';

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

@Component({
  selector: 'app-scheduler',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scheduler.component.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ],
  styleUrls: ['./scheduler.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SchedulerComponent implements OnInit{
  viewDate = new Date();

  public tmpEventArray: RouteEvent[] = [];

  events: CalendarEvent[] = [
    {
      title: "Example",
      start: addDays(new Date(),1),
      meta: {
        tmpEvent: true,
      }
    }
  ];

  dragToCreateActive = false;

  locale: string = 'hu';

  weekStartsOn: 0 = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private calendarEventService: CalendarEventService
    ) {
    registerLocaleData(localeHu)
  }

  async ngOnInit(): Promise<void>{
    this.tmpEventArray = await this.calendarEventService.getCalendarEvents();
    await this.loadDataFromDatabase();
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
      const dragToSelectEvent: CalendarEvent = {
        id: this.events.length,
        title: 'New event',
        start: segment.date,
        meta: {
          tmpEvent: true
        }
      };
      this.events = [...this.events, dragToSelectEvent];
      const segmentPosition = segmentElement.getBoundingClientRect();
      this.dragToCreateActive = true;
      const endOfView = endOfWeek(this.viewDate, {
        weekStartsOn: this.weekStartsOn
      });

      fromEvent(document, 'mousemove')
        .pipe(
          finalize(() => {
            delete dragToSelectEvent.meta.tmpEvent;
            this.dragToCreateActive = false;
            this.refresh();
          }),
          takeUntil(fromEvent(document, 'mouseup'))
        )
        .subscribe((mouseMoveEvent: MouseEvent) => {
          const minutesDiff = ceilToNearest(
            mouseMoveEvent.clientY - segmentPosition.top,
            30
          );

          const daysDiff =
            floorToNearest(
              mouseMoveEvent.clientX - segmentPosition.left,
              segmentPosition.width
            ) / segmentPosition.width;

          const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
          if (newEnd > segment.date && newEnd < endOfView) {
            dragToSelectEvent.end = newEnd;
          }
          this.refresh();
    });
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  loadDataFromDatabase(){
    this.tmpEventArray.forEach(element => {
      this.events.push({
        title: element.event_title,
        start: addDays(new Date,2),
        meta: {
          tmpEvent: true,
        }
      })
    })
    this.refresh();
  }

}
