import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtemisSharedCommonModule } from 'app/shared/shared-common.module';
import { ArtemisExamTimerModule } from 'app/exam/participate/timer/exam-timer.module';
import { ArtemisExamLiveEventsModule } from 'app/exam/participate/events/exam-live-events.module';
import { ExamParticipationService } from 'app/exam/participate/exam-participation.service';
import { Exercise, ExerciseType } from 'app/entities/exercise.model';
import { faDoorClosed } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs/esm';

@Component({
    selector: 'jhi-exam-bar',
    standalone: true,
    imports: [CommonModule, ArtemisSharedCommonModule, ArtemisExamTimerModule, ArtemisExamLiveEventsModule],
    templateUrl: './exam-bar.component.html',
    styleUrl: './exam-bar.component.scss',
})
export class ExamBarComponent implements AfterViewInit {
    @Output() onExamHandInEarly = new EventEmitter<void>();
    @Output() examAboutToEnd = new EventEmitter<void>();
    @Output() heightChange = new EventEmitter<number>();

    @Input() examTitle: string;
    @Input() examTimeLineView = false;
    @Input() endDate: dayjs.Dayjs;
    @Input() exerciseIndex = 0;
    @Input() exercises: Exercise[] = [];
    @Input() examStartDate: dayjs.Dayjs;

    readonly faDoorClosed = faDoorClosed;
    criticalTime = dayjs.duration(5, 'minutes');
    private previousHeight: number;

    constructor(private elementRef: ElementRef) {}

    /**
     * It sets up a ResizeObserver to monitor changes in the height of the exam bar element.
     * When a change in height is detected, it triggers the onHeightChange method,
     * passing the new height as an argument.
     */
    ngAfterViewInit(): void {
        const barElement = this.elementRef.nativeElement.querySelector('.exam-bar');
        this.previousHeight = barElement.offsetHeight;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === barElement) {
                    const newHeight = entry.contentRect.height;
                    if (newHeight !== this.previousHeight) {
                        this.previousHeight = newHeight;
                        this.onHeightChange(newHeight);
                    }
                }
            }
        });
        resizeObserver.observe(barElement);
    }
    /**
     * Save the currently active exercise
     */
    saveExercise() {
        const submission = ExamParticipationService.getSubmissionForExercise(this.exercises[this.exerciseIndex]);
        // we do not submit programming exercises on a save
        if (submission && this.exercises[this.exerciseIndex].type !== ExerciseType.PROGRAMMING) {
            submission.submitted = true;
        }
    }

    triggerExamAboutToEnd() {
        this.saveExercise();
        this.examAboutToEnd.emit();
    }

    /**
     * Notify parent component when user wants to hand in early
     */
    handInEarly() {
        this.onExamHandInEarly.emit();
    }

    /**
     * Notify parent component when the height of the bar changes
     */
    onHeightChange(newHeight: number) {
        this.heightChange.emit(newHeight);
    }
}
