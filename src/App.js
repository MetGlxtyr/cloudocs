import { Route, Routes } from 'react-router-dom';
import AuthRoute from '@/components/AuthRoute';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import './App.css'

const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Home = lazy(() => import('@/pages/Home'));
const Article = lazy(() => import('@/pages/Article'));
const Layout = lazy(() => import('@/pages/Layout'));
const Publish = lazy(() => import('@/pages/Publish'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Agreement = lazy(() => import('@/pages/Agreement'));

export default function App() {
  return (
    <div className="App">
      <Suspense
        fallback={
          <Spin size='large' />
        }
      >
        <Routes>
          <Route path='/*' element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }>
            <Route element={<Home />} />
            <Route index path='article' element={<Article />} />
            <Route path='publish' element={<Publish />} />
            <Route path='*' element={<NotFound />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/agreement' element={<Agreement />} />
        </Routes>
      </Suspense>
    </div>
  );
}
