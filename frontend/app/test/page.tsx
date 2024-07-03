'use client';
import DetailViewMetrics from "../components/detail_view_metrics_sleep";

const DetailViewSleepPage = () => {
    const date = "2024-07-01"; // Example date, replace with actual date

    return (
        <div className="pl-[56px]">
            <DetailViewMetrics date={date} />
        </div>
    )
}

export default DetailViewSleepPage