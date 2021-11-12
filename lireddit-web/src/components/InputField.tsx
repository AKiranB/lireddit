import React from "react";
import { useField } from "formik"
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { values } from "lodash";
import { Center, Flex, Textarea } from "@chakra-ui/react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    textarea?: boolean;
};



export const InputField: React.FC<InputFieldProps> = ({
    label,
    textarea,
    size: _,
    ...props
}) => {
    const [field, { error }] = useField(props);
    // let C = Input
    // if (textarea) {
    //     C = Textarea
    // }
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            {textarea ?
                (<Textarea
                    {...field}
                    id={field.name}

                />) : (
                    <Input
                        {...field}
                        {...props}
                        id={field.name}
                    />)}
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>

    )



}