import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { DataService } from './data.service';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';

const Y_AXIS_SCALE: number = 10;

export interface YearBucket {
  [bucket: number]: number;
}

export interface ChartData {
  frequency: YearBucket;
  maxYAxisValue: number;
}

export interface ChartState {
  data: ChartData;
  status: 'loading' | 'ready' | 'error';
}

@Pipe({
  name: 'yAxisValues',
})
export class YAxisValuesPipe implements PipeTransform {
  transform(maxYAxisValue: number): number[] {
    return Array.from(
      { length: maxYAxisValue / Y_AXIS_SCALE },
      (_, i) => (i + 1) * Y_AXIS_SCALE,
    );
  }
}

@Pipe({
  name: 'barHeight',
})
export class BarHeightPipe implements PipeTransform {
  transform(count: number, maxYAxisValue: number): number {
    return maxYAxisValue <= 0 ? 0 : (count / maxYAxisValue) * 100;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly BUCKET_SIZE = 10;
  private readonly COUNT = 200;
  private readonly dataService = inject(DataService);

  readonly buttonClickEvent$ = new ReplaySubject<void>(1);

  bucketLabels: number[] = Array.from({
    length: Math.ceil((2019 - 1950) / this.BUCKET_SIZE),
  }).map((_, index) => 1950 + index * this.BUCKET_SIZE);

  chartState$!: Observable<ChartState>;

  ngOnInit() {
    this.chartState$ = this.buttonClickEvent$.pipe(
      switchMap(() =>
        this.dataService.fetchYearsData().pipe(
          map((yearsData: number[]) => ({
            data: this.createChartData(yearsData),
            status: 'ready' as const,
          })),
          startWith({
            data: this.createChartData([]),
            status: 'loading' as const,
          }),
          catchError(() =>
            of({
              data: this.createChartData([]),
              status: 'error' as const,
            }),
          ),
        ),
      ),
    );
    this.refreshData();
  }

  refreshData() {
    this.buttonClickEvent$.next();
  }

  private createChartData(years: number[]): ChartData {
    const frequency = this.groupIntoBuckets(years);
    const maxBucketFrequency = Math.max(0, ...Object.values(frequency));
    const maxYAxisValue = Math.max(
      Y_AXIS_SCALE,
      Math.min(
        Math.ceil(maxBucketFrequency / Y_AXIS_SCALE) * Y_AXIS_SCALE,
        this.COUNT,
      ),
    );

    return { frequency, maxYAxisValue };
  }

  private groupIntoBuckets(years: number[]): YearBucket {
    const frequency: YearBucket = {};
    years.forEach((year) => {
      const bucket: number =
        Math.floor(year / this.BUCKET_SIZE) * this.BUCKET_SIZE;
      frequency[bucket] = (frequency[bucket] || 0) + 1;
    });
    return frequency;
  }
}
