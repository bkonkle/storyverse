export interface CardProfileStatProps {
  name: string
  value: string
}

export const CardProfileStat = ({name, value}: CardProfileStatProps) => {
  return (
    <div className="mr-4 p-3 text-center">
      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
        {value}
      </span>
      <span className="text-sm text-blueGray-400">{name}</span>
    </div>
  )
}

export default CardProfileStat
