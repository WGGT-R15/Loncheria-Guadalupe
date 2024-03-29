import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  updateDoc,
} from '@firebase/firestore'
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { stringify } from 'querystring'
import db from '../firebase/firebaseConfig'
import { ProductTypes } from '../shared/types'
import type { RootState } from './store'

export const addNewRecipe = createAsyncThunk(
  'recipe/addRecipe',
  // async (userId, thunkAPI) => {
  //   const response = await userAPI.fetchById(userId)
  //   return response.data
  // }
  async (payload: ProductTypes, thunkAPI) => {
    const docRef = await addDoc(collection(db, `recipes`), {
      ...payload,
    })
    return docRef
  }
)

export const deleteRecipe = createAsyncThunk(
  'recipe/deleteRecipe',
  async (payload: { id: string }, thunkAPI) => {
    const docRef = await deleteDoc(doc(db, 'recipes', payload.id))
    return docRef
  }
)

export const deleteVariant = createAsyncThunk(
  'recipe/deleteVariant',
  async (payload: { id: string; fieldName: string }, thunkAPI) => {
    const docRef = doc(db, 'recipes', payload.id)
    const docSnap = await getDoc(docRef)

    // const recipes = data.docs[0].data()

    const getPropertyIndex = docSnap
      .data()!
      .variants.findIndex((curr: any) => {
        if (curr.name === payload.fieldName) return true
      })

    await updateDoc(docRef, {
      variants: docSnap
        .data()!
        .variants.filter((curr: any) => curr.name !== payload.fieldName),
    })

    return ''
  }
)

// Define a type for the slice state
interface recipeState {
  value: number
}

// Define the initial state using that type
const initialState: recipeState = {
  value: 0,
}

export const recipeSlice = createSlice({
  name: 'recipe',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(addNewRecipe.fulfilled, (state, action) => {
      // Add user to the state array
      console.log('Successful')
    })
    builder.addCase(addNewRecipe.rejected, (state, action) => {
      // Add user to the state array
      console.log(':(')
    })
    builder.addCase(deleteRecipe.fulfilled, (state, action) => {
      // Add user to the state array
      console.log('Successful')
    })
    builder.addCase(deleteRecipe.rejected, (state, action) => {
      // Add user to the state array
      console.log(':(')
    })
  },
})

export const { increment, decrement, incrementByAmount } =
  recipeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.recipe.value

export default recipeSlice.reducer
