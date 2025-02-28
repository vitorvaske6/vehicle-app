import { Button, Textarea, Input, Form, Select, SelectItem } from '@heroui/react'
import { useState } from 'react'

interface FormValues {
  [key: string]: string | null;
  plate: string | null;
  chassis: string | null;
  model: string | null;
  color: string | null;
  year: string | null;
  offenseDate: string | null;
  offenseType: string | null;
  lastSignal: string | null;
  incidentAddress: string | null;
}
const NewVehiclePage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formValues, setFormValues] = useState<FormValues>({
    plate: null,
    chassis: null,
    model: null,
    color: null,
    year: null,
    offenseDate: null,
    offenseType: null,
    lastSignal: null,
    incidentAddress: null,
  });

  const [textToParse, setTextToParse] = useState('')

  const submitExtractionText = async () => {
    if (!textToParse) {
      return
    }
    try {

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToParse })
      })
      const data = await response.json()
    
      Object.entries(data).forEach(([key, value]) => {
        setFormValues(prev => ({ ...prev, [key]: value?.toString() ?? null }))
      })


    } catch (error) {
      console.error('error', error)
    }
  }

  // const onSubmit = async (data: VehicleFormData) => {
  //   // Add user ID and company from session
  //   await fetch('/api/vehicles', {
  //     method: 'POST',
  //     body: JSON.stringify(data)
  //   })
  // }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Custom validation checks
    const newErrors = {};

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }
    await fetch('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    // Clear errors and submit
    setErrors({});
    setSubmitted(true);
  };

  const fields = [
    { name: 'plate', label: 'Placa do Veículo' },
    { name: 'chassis', label: 'Chassi' },
    { name: 'model', label: "Modelo/Marca" },
    { name: 'color', label: "Cor" },
    { name: 'year', label: "Ano", type: "number" },
    { name: 'offenseDate', label: "Data/Hora do Delito", type: "datetime-local" },
    { name: 'offenseType', label: "Tipo de Delito" },
    { name: 'lastSignal', label: "Último Sinal" },
    { name: 'incidentAddress', label: "Endereço do Incidente" },
  ]

  return (
    <div >
      <div className="w-full justify-center items-center space-y-4">
        <div className="flex flex-col gap-4 max-w-md">
          <Textarea
            label="Raw Data"
            onBlur={(e) => setTextToParse(e.target.value)}
          />
          <Button type="button" isDisabled={textToParse === ''} onPress={() => submitExtractionText()}>Extract vehicles data</Button>
        </div >
      </div >

      <Form
        className="w-full justify-center items-center space-y-4"
        validationErrors={errors}
        onReset={() => setSubmitted(false)}
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4 max-w-md">
          {fields.map((field) => (
            <>
              <Input isRequired
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return field.label + " é obrigatório!";
                  }

                  return errors[`${field.name}`];
                }}
                label={field.label}
                type={field.type || "text"}
                labelPlacement="outside"
                name={field.name}
                placeholder={""}
                value={formValues[field.name] || ''}
                onValueChange={(value) => setFormValues(prev => ({ ...prev, [field.name]: value }))}
              />
            </>
          ))}

          <Select
            isRequired
            label="Empresa"
            labelPlacement="outside"
            name="company"
            placeholder="Selecione a empresa"
          >
            <SelectItem key="carsys">CarSys</SelectItem>
          </Select>

          <div className="flex gap-4">
            <Button className="w-full" color="primary" type="submit">
              Submit
            </Button>
            <Button type="reset" variant="bordered">
              Reset
            </Button>
          </div>
        </div>

        {submitted && (
          <div className="text-small text-default-500 mt-4">
            Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </Form>
      <Button type="submit">Register Vehicle</Button>
    </div>
  )
}

export default NewVehiclePage