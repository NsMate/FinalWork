import { Injectable } from '@angular/core';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RouteEvent } from 'src/app/models/Warehousing/RouteEvent/route-event'

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {

  private eventUrl: string = "http://localhost:8080/calendar_events";

  constructor(
    private http: HttpClient
  ) { }

  getCalendarEvents(): Promise<RouteEvent[]> {
    return this.http.get<RouteEvent[]>(`${this.eventUrl}`, httpOptions).toPromise();
  }

  getCalendarEvent(id: number): Promise<RouteEvent> {
    return this.http.get<RouteEvent>(`${this.eventUrl}/${id}`, httpOptions).toPromise();
  }
  
  createCalendarEvent(calendarEvent: RouteEvent): Promise<RouteEvent> {
    return this.http.post<RouteEvent>(`${this.eventUrl}`, calendarEvent, httpOptions).toPromise();
  }
  
  updateCalendarEvent(calendarEvent: RouteEvent): Promise<RouteEvent> {
    return this.http.put<RouteEvent>(`${this.eventUrl}/${calendarEvent.id}`, calendarEvent, httpOptions).toPromise();
  }
  
  deleteCalendarEvent(id): Promise<RouteEvent> {
    return this.http.delete<RouteEvent>(`${this.eventUrl}/${id}`, httpOptions).toPromise();
  }
}
