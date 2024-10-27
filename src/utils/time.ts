import moment from "moment"

export const timeDeltaHumanize = (created: string): string => {
    const now = moment()

    const publishedDate = moment(new Date(created))

    return moment.duration(publishedDate.diff(now)).humanize(true)
}
