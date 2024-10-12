import { View, TextInput, Image } from "react-native";
import { router, Href } from "expo-router";

import * as icons from "@/constants/icons";

interface CustomSearchProps {
  width?: string;
  route?: Href<string>;
  onChangeText: (text: string) => void;
  searchValue: string;
  placeholder: string;
}

const CustomSearch = ({
  width,
  route,
  onChangeText,
  searchValue,
  placeholder,
}: CustomSearchProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-between p-2 bg-neutral-100 shadow-sm shadow-neutral-50 rounded-full h-50 w-[260px] relative`}
    >
      <Image source={icons.search} className="w-6 h-6 ml-2" />
      <TextInput
        value={searchValue} // Bind the input value
        onChangeText={onChangeText} // Update the input value
        autoFocus={false}
        className="w-full h-full p-2 z-0"
        placeholder={placeholder}
        placeholderTextColor={"gray"}
        selectionColor={"black"}
        onPress={() => {
          if (route) {
            router.push(route);
          }
        }}
      />
    </View>
  );
};

export default CustomSearch;
