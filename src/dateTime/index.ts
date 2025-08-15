import moment from "moment"

export const periodsValues = {
  'today': () => {
    const di = moment().startOf('day')
    const df = moment().endOf('day')
    const label = 'HOJE'

    return { di, df, label }
  },
  'days_last30': () => {
    const di = moment().subtract(29, 'day').startOf('day')
    const df = moment().endOf('day')
    const label = 'Últimos 30 dias'

    return { di, df, label }
  },
  'days_last14': () => {
    const di = moment().subtract(13, 'day').startOf('day')
    const df = moment().endOf('day')
    const label = 'Últimos 14 dias'

    return { di, df, label }
  },
  'days_last07': () => {
    const di = moment().subtract(6, 'day').startOf('day')
    const df = moment().endOf('day')
    const label = 'Últimos 7 dias'

    return { di, df, label }
  },
  'week_lastBefore': () => {
    const start = moment().startOf('week').subtract(2, 'week').startOf('day')
    const di = start
    const df = moment(start).endOf('week').endOf('day')
    const label = 'Semana Retrasada'

    return { di, df, label }
  },
  'week_last': () => {
    const start = moment().startOf('week').subtract(1, 'week').startOf('day')
    const di = start
    const df = moment(start).endOf('week').endOf('day')
    const label = 'Semana Passada'

    return { di, df, label }
  },
  'week_this': () => {
    const di = moment().startOf('week').startOf('day')
    const df = moment().endOf('day')
    const label = 'Esta Semana'

    return { di, df, label }
  },
  'month_lastBefore': () => {
    const start = moment().startOf('month').subtract(2, 'month').startOf('day')
    const di = start
    const df = moment(start).endOf('month').endOf('day')
    const label = 'Mês Retrasado'

    return { di, df, label }
  },
  'month_last': () => {
    const start = moment().startOf('month').subtract(1, 'month').startOf('day')
    const di = start
    const df = moment(start).endOf('month').endOf('day')
    const label = 'Mês Passado'

    return { di, df, label }
  },
  'month_this': () => {
    const di = moment().startOf('month').startOf('day')
    const df = moment().endOf('day')
    const label = 'Este Mês'

    return { di, df, label }
  },
  'quarter_lastBefore': () => {
    const start = moment().startOf('quarter').subtract(2, 'quarter').startOf('day')
    const di = start
    const df = moment(start).endOf('quarter').endOf('day')
    const label = 'Penúltimo Trimestre'

    return { di, df, label }
  },
  'quarter_last': () => {
    const start = moment().startOf('quarter').subtract(1, 'quarter').startOf('day')
    const di = start
    const df = moment(start).endOf('quarter').endOf('day')
    const label = 'Trimestre Passado'

    return { di, df, label }
  },
  'quarter_this': () => {
    const di = moment().startOf('quarter').startOf('day')
    const df = moment().endOf('day')
    const label = 'Este Trimestre'

    return { di, df, label }
  },
  'year_lastBefore': () => {
    const start = moment().startOf('year').subtract(2, 'year').startOf('day')
    const di = start
    const df = moment(start).endOf('year').endOf('day')
    const label = 'Penúltimo Ano'

    return { di, df, label }
  },
  'year_last': () => {
    const start = moment().startOf('year').subtract(1, 'year').startOf('day')
    const di = start
    const df = moment(start).endOf('year').endOf('day')
    const label = 'Ano Passado'

    return { di, df, label }
  },
  'year_this': () => {
    const di = moment().startOf('year').startOf('day')
    const df = moment().endOf('day')
    const label = 'Este Ano'

    return { di, df, label }
  },
}

export type PeriodValuesKeys = keyof typeof periodsValues;