import moment from "moment"

export const timeDeltaHumanize = (created: string): string => {
    const now = moment()

    const publishedDate = moment(new Date(created))

    return moment.duration(publishedDate.diff(now)).humanize(true)
}

export const getDiffHours = (created: string): number => {
    const duration = moment.duration(moment().diff(moment(new Date(created))))

    return duration.asHours()
}

export function formatTime(created: string, format: string): string {
    return moment(new Date(created)).format(format)
}
