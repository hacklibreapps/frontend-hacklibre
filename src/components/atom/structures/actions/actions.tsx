'use client'
import Link from 'next/link'
import { useState } from 'react'
import { PiDotsThreeLight } from 'react-icons/pi'
import {
  RiEditLine,
  RiEye2Line,
  RiDeleteBin7Line,
  RiToggleLine
} from 'react-icons/ri'

import { IoKeyOutline } from 'react-icons/io5'
import { LuTimerReset } from 'react-icons/lu'
import { TbGift, TbMapPinStar } from 'react-icons/tb'
import { useAuth } from '@/context/authContext'
import { FaFileDownload } from 'react-icons/fa'

interface ActionsProps {
  viewLink?: string
  editLink?: string
  deleteLink?: string
  pdfLink?: string
  permPdf?: string
  onDownloadPdf?: (uuid: string) => void
  permView?: string
  permEdit?: string
  permDelete?: string
  changePasswordLink?: string
  permChangePassword?: string
  onChangePassword?: () => void
  historialLink?: string
  permHistorial?: string
  canjeLink?: string
  permCanje?: string
  editZonaPrimaDistrictLink?: string
  permEditZonaPrimaDistrict?: string
  onDelete?: () => void
  /** NUEVO: toggle de activo */
  active?: boolean
  onToggle?: () => void
  permToggle?: string
  loadingToggle?: boolean
  toggleTitles?: { activate?: string; deactivate?: string }
}

const Actions: React.FC<ActionsProps> = ({
  viewLink,
  editLink,
  deleteLink,
  pdfLink,
  permPdf,
  onDownloadPdf,
  permView,
  permEdit,
  permDelete,
  changePasswordLink,
  permChangePassword,
  onChangePassword,
  editZonaPrimaDistrictLink,
  permEditZonaPrimaDistrict,
  onDelete,
  historialLink,
  permHistorial,
  canjeLink,
  permCanje,

  // NUEVO
  active,
  onToggle,
  permToggle,
  loadingToggle = false,
  toggleTitles
}) => {
  const { hasPermission } = useAuth()
  const [currentAction, setCurrentAction] = useState<string>('---')
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const handleShowMenuActions = () => {
    setShowMenu(true)
  }
  const handleHiddenMenuActions = () => {
    setShowMenu(false)
  }
  const handleChangeCurrent = (current: string) => {
    setCurrentAction(current)
    setShowMenu(false)
  }

  const resetCurrentAction = () => {
    setCurrentAction('---')
  }

  const handlerDonwloadPdf = (action: string, uuid: string) => {
    handleChangeCurrent(action)
    if (onDownloadPdf && pdfLink) {
      onDownloadPdf(uuid) // Asegúrate de pasar el UUID aquí
    }
  }

  //NUEVO
  const labelActivate = toggleTitles?.activate ?? 'Activar'
  const labelDeactivate = toggleTitles?.deactivate ?? 'Desactivar'
  const canShowToggle =
    typeof active === 'boolean' &&
    !!onToggle &&
    (!permToggle || hasPermission(permToggle))

  return (
    <div className='relative px-2 w-full h-full flex flex-col justify-center items-center bg-WhiteBone'>
      <div
        onClick={handleShowMenuActions}
        className='border-b border-Cian8 w-full h-6 pb-2 flex flex-col justify-center items-center'
      >
        {currentAction === 'VER' ? (
          <p className='text-2xl text-blue-400'>
            <RiEye2Line />
          </p>
        ) : currentAction === 'EDITAR' ? (
          <p className='text-2xl text-green-700'>
            <RiEditLine />
          </p>
        ) : currentAction === 'ELIMINAR' ? (
          <p className='text-2xl text-red-500'>
            <RiDeleteBin7Line />
          </p>
        ) : currentAction === 'HISTORIAL' ? (
          <p className='text-2xl text-Orangevivido'>
            <LuTimerReset />
          </p>
        ) : currentAction === 'CANJE' ? (
          <p className='text-2xl text-Orangevivido'>
            <LuTimerReset />
          </p>
        ) : currentAction === 'ZONAPRIMA' ? (
          <p className='text-2xl text-blue-500'>
            <TbMapPinStar />
          </p>
        ) : //NUEVO
        currentAction === 'ACTIVAR' ? (
          <p className='text-2xl text-emerald-600'>
            <RiToggleLine />
          </p>
        ) : currentAction === 'DESACTIVAR' ? (
          <p className='text-2xl text-rose-600'>
            <RiToggleLine />
          </p>
        ) : currentAction === 'PDF' ? (
          <p className='text-2xl text-rose-600'>
            <FaFileDownload />
          </p>
        ) : (
          <p className='text-2xl  text-Charcoal'>
            <PiDotsThreeLight />
          </p>
        )}
      </div>
      {showMenu ? (
        <div
          onMouseEnter={handleShowMenuActions}
          onMouseLeave={handleHiddenMenuActions}
          className='absolute top-0 bg-Greys border w-full flex flex-col justify-center items-center z-10'
        >
          <Link
            className='h-8 hover:bg-blue-100 w-full flex flex-row justify-center items-center text-Charcoal'
            onClick={() => handleChangeCurrent('---')}
            href='#'
          >
            <p className='text-2xl text-Charcoal'>
              <PiDotsThreeLight />
            </p>
          </Link>
          {viewLink && permView ? (
            hasPermission(permView) ? (
              <Link
                className='h-8 hover:bg-blue-100 w-full flex flex-row justify-center items-center'
                onClick={() => handleChangeCurrent('VER')}
                href={viewLink}
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content={'Ver'}
              >
                <p className='text-2xl text-blue-400'>{<RiEye2Line />}</p>
              </Link>
            ) : null
          ) : null}

          {(changePasswordLink || onChangePassword) && permChangePassword ? (
            hasPermission(permChangePassword) ? (
              changePasswordLink ? (
                <Link
                  className='h-8 hover:bg-Green/20 w-full flex flex-row justify-center items-center'
                  onClick={() => handleChangeCurrent('CAMBIAR CONTRASEÑA')}
                  href={changePasswordLink}
                  data-tooltip-id='tooltip'
                  data-tooltip-place='left'
                  data-tooltip-content={'Cambiar contraseña'}
                >
                  <p className='text-2xl text-Red'>
                    <IoKeyOutline />
                  </p>
                </Link>
              ) : (
                <div
                  className='h-8 hover:bg-Green/20 w-full flex flex-row justify-center items-center cursor-pointer'
                  onClick={() => {
                    handleChangeCurrent('CAMBIAR CONTRASEÑA')
                    onChangePassword?.()
                  }}
                  data-tooltip-id='tooltip'
                  data-tooltip-place='left'
                  data-tooltip-content={'Cambiar contraseña'}
                >
                  <p className='text-2xl text-Red'>
                    <IoKeyOutline />
                  </p>
                </div>
              )
            ) : null
          ) : null}

          {editLink && permEdit ? (
            hasPermission(permEdit) ? (
              <Link
                className='h-8 hover:bg-blue-100 w-full flex flex-row justify-center items-center'
                onClick={() => handleChangeCurrent('EDITAR')}
                href={editLink}
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content={'Editar'}
              >
                <p className='text-2xl text-green-700'>{<RiEditLine />}</p>
              </Link>
            ) : null
          ) : null}

          {/* NUEVO: Activar/Desactivar */}
          {canShowToggle && (
            <div
              className={`h-8 w-full flex flex-row justify-center items-center cursor-pointer ${
                active ? 'hover:bg-rose-100' : 'hover:bg-emerald-100'
              } ${loadingToggle ? 'opacity-60 pointer-events-none' : ''}`}
              onClick={() => {
                handleChangeCurrent(active ? 'DESACTIVAR' : 'ACTIVAR')
                onToggle?.()
                resetCurrentAction()
              }}
              data-tooltip-id='tooltip'
              data-tooltip-place='left'
              data-tooltip-content={active ? labelDeactivate : labelActivate}
            >
              <p
                className={`text-2xl ${
                  active ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                <RiToggleLine />
              </p>
            </div>
          )}

          {/* DELETE: si hay deleteLink navega; si hay onDelete usa callback */}
          {permDelete && hasPermission(permDelete) ? (
            deleteLink ? (
              <Link
                className='h-8 hover:bg-blue-100 w-full flex flex-row justify-center items-center'
                onClick={() => handleChangeCurrent('ELIMINAR')}
                href={deleteLink}
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content='Eliminar'
              >
                <p className='text-2xl text-Red'>
                  <RiDeleteBin7Line />
                </p>
              </Link>
            ) : onDelete ? (
              <div
                className='h-8 hover:bg-blue-100 w-full text-red-500 flex flex-row justify-center items-center cursor-pointer'
                onClick={() => {
                  handleChangeCurrent('ELIMINAR')
                  onDelete()
                  resetCurrentAction()
                }}
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content='Eliminar'
              >
                <p className='text-2xl text-Red'>
                  <RiDeleteBin7Line />
                </p>
              </div>
            ) : null
          ) : null}
          {historialLink && permHistorial ? (
            hasPermission(permHistorial) ? (
              <Link
                className='h-8 hover:bg-blue-100 w-full flex flex-row justify-center items-center'
                onClick={() => handleChangeCurrent('HISTORIAL')}
                href={historialLink}
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content={'Historial de Puntos'}
              >
                <p className='text-2xl text-Orangevivido'>{<LuTimerReset />}</p>
              </Link>
            ) : null
          ) : null}
          {canjeLink && permCanje ? (
            hasPermission(permCanje) ? (
              <Link
                className='h-8 hover:bg-blue-100 w-full flex flex-row justify-center items-center'
                onClick={() => handleChangeCurrent('CANJE')}
                href={canjeLink}
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content={'Historial de Canje'}
              >
                <p className='text-2xl text-red-700'>{<TbGift />}</p>
              </Link>
            ) : null
          ) : null}
          {editZonaPrimaDistrictLink && permEditZonaPrimaDistrict ? (
            hasPermission(permEditZonaPrimaDistrict) ? (
              <Link
                className='h-8 hover:bg-blue-100 w-full flex flex-row justify-center items-center'
                onClick={() => handleChangeCurrent('ZONAPRIMA')}
                href={editZonaPrimaDistrictLink}
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content={'Distritos de la Zona Prima'}
              >
                <p className='text-2xl text-blue-500'>{<TbMapPinStar />}</p>
              </Link>
            ) : null
          ) : null}

          {pdfLink && permPdf ? (
            hasPermission(permPdf) ? (
              <div
                className='h-8 cursor-pointer hover:bg-blue-100 w-full flex flex-row justify-center items-center'
                onClick={() => handlerDonwloadPdf('PDF', pdfLink)} // Pasando 'pdfLink' como argumento
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content={'Descargar Cotización PDF'}
              >
                <p className='text-2xl text-red-500'>{<FaFileDownload />}</p>
              </div>
            ) : null
          ) : null}

          {/* {pdfLink && permPdf ? (
            hasPermission(permPdf) ? (
              <div
               className='h-8 cursor-pointer hover:bg-blue-100 w-full flex flex-row justify-center items-center'
                onClick={() => handlerDonwloadPdf('PDF')}
                data-tooltip-id='tooltip'
                data-tooltip-place='left'
                data-tooltip-content={'Descargar Cotización PDF'}
              >
                {' '}
                <p className='text-2xl text-red-500'>{<FaFileDownload  />}</p>
              </div>
            ) : null
          ) : null} */}
        </div>
      ) : null}
    </div>
  )
}
export default Actions
