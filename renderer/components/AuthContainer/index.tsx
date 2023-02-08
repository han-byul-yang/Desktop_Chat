/* eslint-disable import/no-extraneous-dependencies */
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import styles from './authContainer.module.scss'

interface AuthProps {
  type: string
  handleAuthSubmit: any
}

const AuthContainer = ({ type, handleAuthSubmit }: AuthProps) => {
  const {
    register,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useForm()
  const { nickName, email, password, checkPassword } = getValues()
  const emailRegexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ // w3c email validation
  const onSubmit = type === 'signUp' ? handleAuthSubmit(nickName, email, password) : handleAuthSubmit(email, password)

  return (
    <div className={styles.authFormBox}>
      <p className={styles.helloMessage}>
        {type === 'signUp' ? '어서오세요. 처음뵙겠습니다:)' : '반갑습니다. 또 오셨군요:)'}
      </p>
      <form className={styles.authForm} onSubmit={handleSubmit(() => onSubmit)}>
        {type === 'signUp' && (
          <>
            <p>닉네임</p>
            <input
              {...register('nickName', {
                required: '필수 입력 항목 입니다.',
                maxLength: { value: 8, message: '최대 8자까지 작성할 수 있습니다.' },
              })}
            />
            <ErrorMessage className={styles.errorMessage} errors={errors} name='nickName' as='p' />
          </>
        )}

        <p>이메일</p>
        <input {...register('email', { required: '필수 입력 항목 입니다.', pattern: emailRegexp })} />
        <ErrorMessage
          className={styles.errorMessage}
          errors={errors}
          message='이메일 형식이 올바르지 않습니다.'
          name='email'
          as='p'
        />

        <p>비밀번호</p>
        <input
          type='password'
          {...register('password', {
            required: '필수 입력 항목 입니다.',
            minLength: { value: 4, message: '4자 이상 12자 이하로 입력해주세요.' },
            maxLength: { value: 12, message: '4자 이상 12자 이하로 입력해주세요.' },
          })}
        />
        <ErrorMessage className={styles.errorMessage} errors={errors} name='password' as='p' />

        {type === 'signUp' && (
          <>
            <p>비밀번호 확인</p>
            <input
              type='password'
              {...register('checkPassword', {
                required: '필수 입력 항목 입니다.',
                validate: () => checkPassword === password,
              })}
            />
            <ErrorMessage
              className={styles.errorMessage}
              errors={errors}
              message='비밀번호가 일치하지 않습니다.'
              name='checkPassword'
              as='p'
            />
          </>
        )}
        <input type='submit' value={type === 'signUp' ? '회원가입' : '로그인'} />
      </form>
      {type === 'signUp' ? (
        <div className={styles.askAuth}>
          <p>계정이 있으신가요?</p>
          <Link href='/SignIn'>
            <a>로그인하기</a>
          </Link>
        </div>
      ) : (
        <div className={styles.askAuth}>
          <p>계정이 없으신가요?</p>
          <Link href='/SignUp'>
            <a>회원가입 하기</a>
          </Link>
        </div>
      )}
    </div>
  )
}

export default AuthContainer
